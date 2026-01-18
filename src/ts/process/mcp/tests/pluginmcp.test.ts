import { beforeEach, describe, expect, test } from 'vitest'
import {
    PluginMCPClient,
    getPluginMCPClient,
    resetPluginMCPClient,
    type PluginToolHandler,
} from '../pluginmcp'
import type { RPCToolCallContent } from '../mcplib'

describe('PluginMCPClient', () => {
    let client: PluginMCPClient

    beforeEach(() => {
        resetPluginMCPClient()
        client = new PluginMCPClient()
    })

    describe('registerTool', () => {
        test('registers a tool with prefixed name', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object', properties: {} },
            }

            const prefixedName = client.registerTool('myplugin', tool, handler)

            expect(prefixedName).toBe('myplugin__search')
            expect(client.hasTools()).toBe(true)
        })

        test('throws if tool name is empty', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: '',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            expect(() => client.registerTool('myplugin', tool, handler)).toThrow(
                'Tool name is required and must be a string'
            )
        })

        test('throws if tool name contains invalid characters', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'my tool!',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            expect(() => client.registerTool('myplugin', tool, handler)).toThrow(
                'Tool name can only contain letters, numbers, underscores, and hyphens'
            )
        })

        test('throws if tool name contains separator', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'my__tool',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            expect(() => client.registerTool('myplugin', tool, handler)).toThrow(
                'Tool name cannot contain the separator "__"'
            )
        })

        test('throws if description is missing', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: '',
                inputSchema: { type: 'object' },
            }

            expect(() => client.registerTool('myplugin', tool, handler)).toThrow(
                'Tool description is required and must be a string'
            )
        })

        test('throws if inputSchema is missing', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: null as any,
            }

            expect(() => client.registerTool('myplugin', tool, handler)).toThrow(
                'Tool inputSchema is required and must be an object'
            )
        })

        test('throws if tool is already registered', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            client.registerTool('myplugin', tool, handler)

            expect(() => client.registerTool('myplugin', tool, handler)).toThrow(
                'Tool myplugin__search is already registered'
            )
        })

        test('allows same tool name for different plugins', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            const name1 = client.registerTool('plugin1', tool, handler)
            const name2 = client.registerTool('plugin2', tool, handler)

            expect(name1).toBe('plugin1__search')
            expect(name2).toBe('plugin2__search')
        })

        test('clears cached tools after registration', async () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            // Prime the cache
            await client.getToolList()

            client.registerTool('myplugin', tool, handler)
            const tools = await client.getToolList()

            expect(tools).toHaveLength(1)
            expect(tools[0].name).toBe('myplugin__search')
        })
    })

    describe('unregisterTool', () => {
        test('removes a registered tool', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            client.registerTool('myplugin', tool, handler)
            expect(client.hasTools()).toBe(true)

            const removed = client.unregisterTool('myplugin__search')

            expect(removed).toBe(true)
            expect(client.hasTools()).toBe(false)
        })

        test('returns false if tool does not exist', () => {
            const removed = client.unregisterTool('nonexistent:tool')
            expect(removed).toBe(false)
        })

        test('clears cached tools after unregistration', async () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }

            client.registerTool('myplugin', tool, handler)

            // Prime the cache
            const toolsBefore = await client.getToolList()
            expect(toolsBefore).toHaveLength(1)

            client.unregisterTool('myplugin__search')
            const toolsAfter = await client.getToolList()

            expect(toolsAfter).toHaveLength(0)
        })
    })

    describe('unregisterPluginTools', () => {
        test('removes all tools from a specific plugin', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]

            client.registerTool('myplugin', { name: 'tool1', description: 'Tool 1', inputSchema: { type: 'object' } }, handler)
            client.registerTool('myplugin', { name: 'tool2', description: 'Tool 2', inputSchema: { type: 'object' } }, handler)
            client.registerTool('otherplugin', { name: 'tool1', description: 'Tool 1', inputSchema: { type: 'object' } }, handler)

            const count = client.unregisterPluginTools('myplugin')

            expect(count).toBe(2)
            expect(client.hasTools()).toBe(true) // otherplugin still has tools
        })

        test('returns 0 if plugin has no tools', () => {
            const count = client.unregisterPluginTools('nonexistent')
            expect(count).toBe(0)
        })
    })

    describe('getToolList', () => {
        test('returns empty array when no tools registered', async () => {
            const tools = await client.getToolList()
            expect(tools).toEqual([])
        })

        test('returns all registered tools', async () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]

            client.registerTool('plugin1', { name: 'tool1', description: 'Tool 1', inputSchema: { type: 'object' } }, handler)
            client.registerTool('plugin2', { name: 'tool2', description: 'Tool 2', inputSchema: { type: 'object' } }, handler)

            const tools = await client.getToolList()

            expect(tools).toHaveLength(2)
            expect(tools.map(t => t.name)).toContain('plugin1__tool1')
            expect(tools.map(t => t.name)).toContain('plugin2__tool2')
        })

        test('caches tool list', async () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            client.registerTool('myplugin', { name: 'tool1', description: 'Tool 1', inputSchema: { type: 'object' } }, handler)

            const tools1 = await client.getToolList()
            const tools2 = await client.getToolList()

            expect(tools1).toBe(tools2) // Same reference (cached)
        })

        test('includes annotations in tool list', async () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            const tool = {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
                annotations: { priority: 1 },
            }

            client.registerTool('myplugin', tool, handler)
            const tools = await client.getToolList()

            expect(tools[0].annotations).toEqual({ priority: 1 })
        })
    })

    describe('getPluginTools', () => {
        test('returns only tools from specified plugin', async () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]

            client.registerTool('plugin1', { name: 'tool1', description: 'Tool 1', inputSchema: { type: 'object' } }, handler)
            client.registerTool('plugin1', { name: 'tool2', description: 'Tool 2', inputSchema: { type: 'object' } }, handler)
            client.registerTool('plugin2', { name: 'tool1', description: 'Tool 1', inputSchema: { type: 'object' } }, handler)

            const plugin1Tools = client.getPluginTools('plugin1')
            const plugin2Tools = client.getPluginTools('plugin2')

            expect(plugin1Tools).toHaveLength(2)
            expect(plugin2Tools).toHaveLength(1)
            expect(plugin1Tools.map(t => t.name)).toEqual(['plugin1__tool1', 'plugin1__tool2'])
        })

        test('returns empty array for unknown plugin', () => {
            const tools = client.getPluginTools('nonexistent')
            expect(tools).toEqual([])
        })
    })

    describe('callTool', () => {
        test('calls handler and returns result', async () => {
            const handler: PluginToolHandler = async (args) => [
                { type: 'text', text: `Query: ${args.query}` }
            ]
            client.registerTool('myplugin', {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }, handler)

            const result = await client.callTool('myplugin__search', { query: 'test' })

            expect(result).toEqual([{ type: 'text', text: 'Query: test' }])
        })

        test('returns error for non-existent tool', async () => {
            const result = await client.callTool('nonexistent__tool', {})

            expect(result).toEqual([{ type: 'text', text: 'Tool nonexistent__tool not found' }])
        })

        test('returns error when handler throws', async () => {
            const handler: PluginToolHandler = async () => {
                throw new Error('Handler failed')
            }
            client.registerTool('myplugin', {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }, handler)

            const result = await client.callTool('myplugin__search', {})

            expect(result).toEqual([
                { type: 'text', text: 'Error executing tool myplugin__search: Handler failed' }
            ])
        })

        test('returns error when handler returns non-array', async () => {
            const handler = async () => 'not an array' as any
            client.registerTool('myplugin', {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }, handler)

            const result = await client.callTool('myplugin__search', {})

            expect(result).toEqual([
                { type: 'text', text: 'Tool myplugin__search returned invalid result (expected array)' }
            ])
        })

        test('returns error when handler returns invalid content items', async () => {
            const handler: PluginToolHandler = async () => [{ invalid: true } as any]
            client.registerTool('myplugin', {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }, handler)

            const result = await client.callTool('myplugin__search', {})

            expect(result).toEqual([
                { type: 'text', text: 'Tool myplugin__search returned invalid content item (missing type)' }
            ])
        })

        test('supports multiple content types in response', async () => {
            const handler: PluginToolHandler = async (): Promise<RPCToolCallContent[]> => [
                { type: 'text', text: 'Here is the result:' },
                { type: 'image', data: 'base64data', mimeType: 'image/png' },
            ]
            client.registerTool('myplugin', {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }, handler)

            const result = await client.callTool('myplugin__search', {})

            expect(result).toHaveLength(2)
            expect(result[0]).toEqual({ type: 'text', text: 'Here is the result:' })
            expect(result[1]).toEqual({ type: 'image', data: 'base64data', mimeType: 'image/png' })
        })
    })

    describe('hasTools', () => {
        test('returns false when no tools registered', () => {
            expect(client.hasTools()).toBe(false)
        })

        test('returns true when tools are registered', () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            client.registerTool('myplugin', {
                name: 'search',
                description: 'Search documents',
                inputSchema: { type: 'object' },
            }, handler)

            expect(client.hasTools()).toBe(true)
        })
    })

    describe('destroy', () => {
        test('removes all tools', async () => {
            const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
            client.registerTool('plugin1', { name: 'tool1', description: 'Tool 1', inputSchema: { type: 'object' } }, handler)
            client.registerTool('plugin2', { name: 'tool2', description: 'Tool 2', inputSchema: { type: 'object' } }, handler)

            client.destroy()

            expect(client.hasTools()).toBe(false)
            expect(await client.getToolList()).toEqual([])
        })
    })

    describe('serverInfo', () => {
        test('returns correct server info', async () => {
            const info = await client.checkHandshake()

            expect(info.serverInfo.name).toBe('Plugin MCP Client')
            expect(info.serverInfo.version).toBe('1.0.0')
            expect(info.capabilities.tools).toEqual({})
            expect(info.instructions).toBe('Tools provided by RisuAI plugins.')
        })
    })
})

describe('Singleton', () => {
    beforeEach(() => {
        resetPluginMCPClient()
    })

    test('getPluginMCPClient returns singleton instance', () => {
        const client1 = getPluginMCPClient()
        const client2 = getPluginMCPClient()

        expect(client1).toBe(client2)
    })

    test('resetPluginMCPClient clears singleton and tools', () => {
        const client = getPluginMCPClient()
        const handler: PluginToolHandler = async () => [{ type: 'text', text: 'result' }]
        client.registerTool('myplugin', {
            name: 'search',
            description: 'Search documents',
            inputSchema: { type: 'object' },
        }, handler)

        expect(client.hasTools()).toBe(true)

        resetPluginMCPClient()

        const newClient = getPluginMCPClient()
        expect(newClient).not.toBe(client)
        expect(newClient.hasTools()).toBe(false)
    })
})
