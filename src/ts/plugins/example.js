//@name example_plugin
//@display-name Example Plugin
//@api 3.0
//@version 1.0.0
//@arg api_key string Your API key for the example service
//@link https://github.com/kwaroran/RisuAI Documentation

/**
 * Example RisuAI Plugin demonstrating API v3.0 features
 *
 * This plugin shows how to:
 * - Register MCP tools that AI can invoke
 * - Register UI elements (settings, buttons)
 * - Use plugin storage
 * - Access the main document safely
 */

(async () => {
    console.log('Example plugin initializing...');

    // ========================================
    // MCP Tool Registration
    // ========================================

    // Register a simple text-returning tool
    const calculatorTool = await risuai.registerMCPTool(
        {
            name: 'calculate',
            description: 'Perform basic arithmetic calculations',
            inputSchema: {
                type: 'object',
                properties: {
                    expression: {
                        type: 'string',
                        description: 'Mathematical expression to evaluate (e.g., "2 + 2")'
                    }
                },
                required: ['expression']
            }
        },
        async (args) => {
            try {
                // Simple safe evaluation for basic math
                const sanitized = args.expression.replace(/[^0-9+\-*/().%\s]/g, '');
                const result = Function(`"use strict"; return (${sanitized})`)();
                return [{
                    type: 'text',
                    text: `Result: ${args.expression} = ${result}`
                }];
            } catch (error) {
                return [{
                    type: 'text',
                    text: `Error: Could not evaluate "${args.expression}"`
                }];
            }
        }
    );
    console.log(`Registered tool: ${calculatorTool}`);

    // Register a tool that returns multiple content types
    await risuai.registerMCPTool(
        {
            name: 'get_time',
            description: 'Get the current date and time',
            inputSchema: {
                type: 'object',
                properties: {
                    timezone: {
                        type: 'string',
                        description: 'Timezone (e.g., "UTC", "America/New_York")'
                    },
                    format: {
                        type: 'string',
                        enum: ['short', 'long', 'iso'],
                        description: 'Output format'
                    }
                },
                required: []
            }
        },
        async (args) => {
            const now = new Date();
            let formatted;

            switch (args.format) {
                case 'iso':
                    formatted = now.toISOString();
                    break;
                case 'long':
                    formatted = now.toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short'
                    });
                    break;
                default:
                    formatted = now.toLocaleString();
            }

            return [{
                type: 'text',
                text: `Current time: ${formatted}`
            }];
        }
    );

    // Register a tool that uses plugin storage
    await risuai.registerMCPTool(
        {
            name: 'note',
            description: 'Save or retrieve a note. Use action "save" to store, "get" to retrieve, "list" to see all notes.',
            inputSchema: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        enum: ['save', 'get', 'list', 'delete'],
                        description: 'Action to perform'
                    },
                    key: {
                        type: 'string',
                        description: 'Note identifier (required for save/get/delete)'
                    },
                    content: {
                        type: 'string',
                        description: 'Note content (required for save)'
                    }
                },
                required: ['action']
            }
        },
        async (args) => {
            const notesKey = 'example_plugin_notes';
            let notes = await risuai.pluginStorage.getItem(notesKey) || {};

            switch (args.action) {
                case 'save':
                    if (!args.key || !args.content) {
                        return [{ type: 'text', text: 'Error: key and content required for save' }];
                    }
                    notes[args.key] = {
                        content: args.content,
                        timestamp: Date.now()
                    };
                    await risuai.pluginStorage.setItem(notesKey, notes);
                    return [{ type: 'text', text: `Note "${args.key}" saved successfully.` }];

                case 'get':
                    if (!args.key) {
                        return [{ type: 'text', text: 'Error: key required for get' }];
                    }
                    const note = notes[args.key];
                    if (!note) {
                        return [{ type: 'text', text: `Note "${args.key}" not found.` }];
                    }
                    return [{ type: 'text', text: `Note "${args.key}": ${note.content}` }];

                case 'list':
                    const keys = Object.keys(notes);
                    if (keys.length === 0) {
                        return [{ type: 'text', text: 'No notes saved.' }];
                    }
                    return [{ type: 'text', text: `Saved notes: ${keys.join(', ')}` }];

                case 'delete':
                    if (!args.key) {
                        return [{ type: 'text', text: 'Error: key required for delete' }];
                    }
                    if (!notes[args.key]) {
                        return [{ type: 'text', text: `Note "${args.key}" not found.` }];
                    }
                    delete notes[args.key];
                    await risuai.pluginStorage.setItem(notesKey, notes);
                    return [{ type: 'text', text: `Note "${args.key}" deleted.` }];

                default:
                    return [{ type: 'text', text: 'Unknown action' }];
            }
        }
    );

    // ========================================
    // UI Registration
    // ========================================

    // Register a settings menu item
    await risuai.registerSetting(
        'Example Plugin Settings',
        async () => {
            // Show the plugin's iframe container
            await risuai.showContainer('fullscreen');

            // Build UI inside the iframe (standard DOM APIs work here)
            document.body.innerHTML = `
                <div style="
                    font-family: system-ui, -apple-system, sans-serif;
                    max-width: 600px;
                    margin: 40px auto;
                    padding: 20px;
                    background: #1a1a2e;
                    color: #eee;
                    border-radius: 12px;
                ">
                    <h1 style="margin-top: 0;">Example Plugin Settings</h1>

                    <div style="margin-bottom: 20px;">
                        <h3>Registered MCP Tools</h3>
                        <div id="tools-list">Loading...</div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3>Plugin Storage</h3>
                        <div id="storage-info">Loading...</div>
                    </div>

                    <button id="close-btn" style="
                        background: #4a4a6a;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                    ">Close</button>
                </div>
            `;

            // Load and display registered tools
            const tools = await risuai.getMCPToolList();
            document.getElementById('tools-list').innerHTML = tools.length > 0
                ? tools.map(t => `<div style="padding: 8px; background: #2a2a4e; margin: 4px 0; border-radius: 4px;">
                    <strong>${t.name}</strong><br/>
                    <small style="color: #aaa;">${t.description}</small>
                  </div>`).join('')
                : '<em>No tools registered</em>';

            // Load and display storage info
            const keys = await risuai.pluginStorage.keys();
            document.getElementById('storage-info').innerHTML =
                `<p>Storage keys: ${keys.length > 0 ? keys.join(', ') : 'none'}</p>`;

            // Close button handler
            document.getElementById('close-btn').addEventListener('click', async () => {
                await risuai.hideContainer();
            });
        },
        '🔧',
        'html'
    );

    // Register a floating action button
    await risuai.registerButton(
        {
            name: 'Example Action',
            icon: '⚡',
            iconType: 'html',
            location: 'action'
        },
        async () => {
            const tools = await risuai.getMCPToolList();
            await risuai.alert(`Example Plugin has ${tools.length} MCP tools registered!`);
        }
    );

    // ========================================
    // Cleanup on unload
    // ========================================

    await risuai.onUnload(async () => {
        console.log('Example plugin unloading...');
        // Tools are automatically unregistered, but you can do custom cleanup here
    });

    console.log('Example plugin initialized successfully!');

})();
