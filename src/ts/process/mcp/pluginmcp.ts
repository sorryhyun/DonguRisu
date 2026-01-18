/**
 * Plugin MCP Client
 *
 * This module provides an MCPClientLike implementation that manages
 * MCP tools registered by plugins via the Plugin API v3.
 */

import { MCPClientLike } from './internalmcp';
import type { MCPTool, RPCToolCallContent } from './mcplib';

/**
 * Handler function type for plugin-registered MCP tools.
 * Called when AI invokes the tool.
 */
export type PluginToolHandler = (args: any) => Promise<RPCToolCallContent[]>;

/**
 * Separator used between plugin name and tool name.
 * Using double underscore since colons are not allowed in tool names
 * (AI APIs require pattern: ^[a-zA-Z0-9_-]{1,128}$)
 */
export const PLUGIN_TOOL_SEPARATOR = '__';

/**
 * Internal storage format for registered plugin tools
 */
export interface PluginMCPToolDefinition {
    /** Name of the plugin that registered this tool */
    pluginName: string;
    /** Original tool name without prefix */
    toolName: string;
    /** Full prefixed name: `{pluginName}__{toolName}` */
    prefixedName: string;
    /** Human-readable description */
    description: string;
    /** JSON Schema for input validation */
    inputSchema: any;
    /** Optional annotations/metadata */
    annotations?: any;
    /** Handler callback (invoked via RPC to plugin iframe) */
    handler: PluginToolHandler;
}

/**
 * MCP client that manages tools registered by plugins.
 *
 * Tools are namespaced by plugin name to prevent collisions.
 * When a tool is invoked, the call is routed to the plugin's
 * handler callback via the RPC mechanism.
 */
export class PluginMCPClient extends MCPClientLike {
    private tools: Map<string, PluginMCPToolDefinition> = new Map();
    cached: {
        tools: MCPTool[];
    } = {
        tools: []
    };

    constructor() {
        super('internal:plugin');
        this.serverInfo = {
            protocolVersion: '2025-03-26',
            capabilities: {
                tools: {}
            },
            serverInfo: {
                name: 'Plugin MCP Client',
                version: '1.0.0'
            },
            instructions: 'Tools provided by RisuAI plugins.'
        };
    }

    /**
     * Register a tool from a plugin
     *
     * @param pluginName - Name of the plugin registering the tool
     * @param tool - Tool definition (name will be auto-prefixed)
     * @param handler - Async function to handle tool calls (callback via RPC)
     * @returns The prefixed tool name
     * @throws Error if tool name already registered or contains invalid characters
     */
    registerTool(
        pluginName: string,
        tool: {
            name: string;
            description: string;
            inputSchema: any;
            annotations?: any;
        },
        handler: PluginToolHandler
    ): string {
        // Validate tool name - must match AI API pattern: ^[a-zA-Z0-9_-]{1,128}$
        if (!tool.name || typeof tool.name !== 'string') {
            throw new Error('Tool name is required and must be a string');
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(tool.name)) {
            throw new Error('Tool name can only contain letters, numbers, underscores, and hyphens');
        }
        if (tool.name.includes(PLUGIN_TOOL_SEPARATOR)) {
            throw new Error(`Tool name cannot contain the separator "${PLUGIN_TOOL_SEPARATOR}"`);
        }
        if (!tool.description || typeof tool.description !== 'string') {
            throw new Error('Tool description is required and must be a string');
        }
        if (!tool.inputSchema || typeof tool.inputSchema !== 'object') {
            throw new Error('Tool inputSchema is required and must be an object');
        }

        const prefixedName = `${pluginName}${PLUGIN_TOOL_SEPARATOR}${tool.name}`;

        // Check for duplicate tool name
        if (this.tools.has(prefixedName)) {
            throw new Error(`Tool ${prefixedName} is already registered`);
        }

        this.tools.set(prefixedName, {
            pluginName,
            toolName: tool.name,
            prefixedName,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: tool.annotations,
            handler
        });

        // Clear cached tools to force refresh
        this.cached.tools = [];

        return prefixedName;
    }

    /**
     * Unregister a specific tool by its prefixed name
     *
     * @param prefixedName - The full prefixed tool name
     * @returns True if tool was found and removed
     */
    unregisterTool(prefixedName: string): boolean {
        const deleted = this.tools.delete(prefixedName);
        if (deleted) {
            this.cached.tools = [];
        }
        return deleted;
    }

    /**
     * Unregister all tools from a specific plugin
     *
     * @param pluginName - Name of the plugin
     * @returns Number of tools removed
     */
    unregisterPluginTools(pluginName: string): number {
        let count = 0;
        for (const [key, tool] of this.tools) {
            if (tool.pluginName === pluginName) {
                this.tools.delete(key);
                count++;
            }
        }
        if (count > 0) {
            this.cached.tools = [];
        }
        return count;
    }

    /**
     * Check if any tools are registered
     */
    hasTools(): boolean {
        return this.tools.size > 0;
    }

    /**
     * Get tools registered by a specific plugin
     */
    getPluginTools(pluginName: string): MCPTool[] {
        return Array.from(this.tools.values())
            .filter(tool => tool.pluginName === pluginName)
            .map(tool => ({
                name: tool.prefixedName,
                description: tool.description,
                inputSchema: tool.inputSchema,
                annotations: tool.annotations
            }));
    }

    /**
     * Get all registered tools
     */
    async getToolList(): Promise<MCPTool[]> {
        if (this.cached.tools.length > 0) {
            return this.cached.tools;
        }

        const tools = Array.from(this.tools.values()).map(tool => ({
            name: tool.prefixedName,
            description: tool.description,
            inputSchema: tool.inputSchema,
            annotations: tool.annotations
        }));

        this.cached.tools = tools;
        return tools;
    }

    /**
     * Call a tool by name
     *
     * Routes the call to the plugin's handler callback via RPC.
     */
    async callTool(toolName: string, args: any): Promise<RPCToolCallContent[]> {
        const tool = this.tools.get(toolName);

        if (!tool) {
            return [{
                type: 'text',
                text: `Tool ${toolName} not found`
            }];
        }

        try {
            // Handler is a callback that goes through RPC to the plugin iframe
            const result = await tool.handler(args);

            // Validate result format
            if (!Array.isArray(result)) {
                return [{
                    type: 'text',
                    text: `Tool ${toolName} returned invalid result (expected array)`
                }];
            }

            // Validate each content item has required fields
            for (const item of result) {
                if (!item || typeof item !== 'object' || !item.type) {
                    return [{
                        type: 'text',
                        text: `Tool ${toolName} returned invalid content item (missing type)`
                    }];
                }
            }

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return [{
                type: 'text',
                text: `Error executing tool ${toolName}: ${errorMessage}`
            }];
        }
    }

    /**
     * Cleanup - unregister all tools
     */
    destroy(): void {
        this.tools.clear();
        this.cached.tools = [];
    }
}

// Singleton instance
let pluginMCPClientInstance: PluginMCPClient | null = null;

/**
 * Get the singleton PluginMCPClient instance
 */
export function getPluginMCPClient(): PluginMCPClient {
    if (!pluginMCPClientInstance) {
        pluginMCPClientInstance = new PluginMCPClient();
    }
    return pluginMCPClientInstance;
}

/**
 * Reset the singleton instance (primarily for testing)
 */
export function resetPluginMCPClient(): void {
    if (pluginMCPClientInstance) {
        pluginMCPClientInstance.destroy();
    }
    pluginMCPClientInstance = null;
}
