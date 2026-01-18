# Plugin System (`/src/ts/plugins`)

This directory implements RisuAI's plugin system with sandboxed execution, DOM safety wrappers, and the v3.0 API.

> **Full Documentation**: See [/plugins.md](../../../plugins.md) for the complete plugin development guide.
> **Migration Guide**: See [migrationGuide.md](./migrationGuide.md) for migrating from v2.0 to v3.0.
> **Type Definitions**: See [apiV3/risuai.d.ts](./apiV3/risuai.d.ts) for API types.

## Directory Structure

| File | Purpose |
|------|---------|
| `plugins.ts` | Plugin import, management, hot-reload |
| `pluginSafety.ts` | Code safety validation |
| `pluginSafeClass.ts` | Safe DOM wrappers (SafeDocument, SafeElement) |
| `apiV3/v3.ts` | V3 API implementation |
| `apiV3/factory.ts` | Sandbox host and RPC |
| `apiV3/transpiler.ts` | TypeScript transpilation |
| `apiV3/developMode.ts` | Development mode utilities |
| `apiV3/risuai.d.ts` | TypeScript type definitions |

## API Versions

| Version | Status | Description |
|---------|--------|-------------|
| `3.0` | Current | Iframe sandbox, SafeElement wrappers |
| `2.1` | Deprecated | Legacy with partial safety |
| `2.0` | Deprecated | Original unsafe API |

## Plugin Metadata Format

```javascript
//@name my_plugin           // Required: unique identifier
//@display-name My Plugin   // Optional: display name
//@api 3.0                  // Required: API version
//@version 1.0.0            // Optional: plugin version
//@arg api_key string       // Arguments: name type [description]
//@arg max_items int
//@arg mode ["simple", "advanced"]  // Enum argument
//@link https://example.com  // Custom links
//@update-url https://...    // Auto-update URL
```

## Key Interfaces

```typescript
interface RisuPlugin {
    name: string
    displayName?: string
    script: string
    arguments: { [key: string]: 'int' | 'string' | string[] }
    realArg: { [key: string]: number | string }
    version?: 1 | 2 | '2.1' | '3.0'
    enabled?: boolean
    updateURL?: string
    versionOfPlugin?: string
}
```

## Plugin Management

```typescript
import { importPlugin, createBlankPlugin, updatePlugin } from './plugins'

// Import from file or string
await importPlugin(codeString)

// Create blank plugin
await createBlankPlugin()

// Update plugin from URL
await updatePlugin(plugin)
```

## Security Model

### Sandbox Architecture (v3.0)

- Plugins run in isolated iframe sandbox
- RPC communication via `postMessage`
- All DOM access through SafeElement wrappers
- Code safety validation before execution

### Safe DOM Classes

```typescript
// From pluginSafeClass.ts
class SafeDocument {
    getElementById(id: string): SafeElement | null
    querySelector(selector: string): SafeElement | null
    createElement(tagName: string): SafeElement
}

class SafeElement {
    appendChild(child: SafeElement): void
    setTextContent(value: string): void
    addClass(className: string): void
    // Only x-* attributes allowed
    setAttribute(name: string, value: string): void
}
```

### Allowed HTML Tags

```typescript
const tagWhitelist = [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
    'a', 'img', 'button', 'input', 'textarea', 'select', 'option',
    'label', 'form', 'br', 'hr', 'pre', 'code', 'strong', 'em'
]
```

## Hot Reload

Development mode with file watching:

```typescript
import { hotReloading } from '../stores.svelte'

// Track hot-reloading plugins
hotReloading // $state<string[]>
```

## Plugin Storage

```typescript
// In plugin code
const storage = Risuai.pluginStorage

// Save-specific storage
await storage.setItem('key', value)
const value = await storage.getItem('key')

// Device-wide storage
await storage.setDeviceItem('key', value)
```

## Custom Provider Support

Plugins can register custom AI providers:

```typescript
import { customProviderStore } from './plugins'

// Store of registered custom provider names
customProviderStore.subscribe(providers => {
    console.log('Custom providers:', providers)
})
```

## Testing Plugins

1. Use hot-reload for rapid iteration
2. Check browser console for errors
3. Validate with `checkCodeSafety()` before distribution

## Related Documentation

- [/plugins.md](../../../plugins.md) - Complete plugin guide
- [migrationGuide.md](./migrationGuide.md) - v2 to v3 migration
- [Parent CLAUDE.md](../CLAUDE.md) - TypeScript core
