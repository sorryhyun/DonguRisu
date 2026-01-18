# TypeScript Core (`/src/ts`)

This directory contains the core TypeScript business logic for RisuAI, including state management, parsing, utilities, and the main subsystems for processing, storage, plugins, and models.

## Key Files

| File | Purpose |
|------|---------|
| `stores.svelte.ts` | Global Svelte 5 state management (stores and runes) |
| `parser.svelte.ts` | Message parsing and template processing |
| `globalApi.svelte.ts` | Platform-agnostic API utilities (file I/O, assets) |
| `bootstrap.ts` | Application initialization and startup |
| `characterCards.ts` | Character card import/export (multiple formats) |
| `cbs.ts` | Callback system for scripts and triggers |
| `tokenizer.ts` | Token counting for various LLM providers |
| `util.ts` | Common utility functions |
| `platform.ts` | Platform detection (Tauri, Capacitor, Node, Web) |

## Directory Structure

| Directory | Purpose | See Also |
|-----------|---------|----------|
| `storage/` | Data persistence layer | [storage/CLAUDE.md](./storage/CLAUDE.md) |
| `process/` | Chat processing pipeline | [process/CLAUDE.md](./process/CLAUDE.md) |
| `plugins/` | Plugin system (API v3.0) | [plugins/CLAUDE.md](./plugins/CLAUDE.md) |
| `model/` | LLM provider integrations | [model/CLAUDE.md](./model/CLAUDE.md) |
| `gui/` | GUI utilities (colorscheme, animation) | - |
| `drive/` | Cloud sync and backup | - |
| `translator/` | Translation system | - |
| `sync/` | Multi-user synchronization | - |
| `creation/` | Character creation tools | - |
| `parser/` | ChatML and CBS parsing | - |

## State Management

### Svelte 5 Runes (`stores.svelte.ts`)

The project uses Svelte 5's runes system with a mix of `$state` and traditional stores:

```typescript
// Runes-based state (preferred for new code)
export const DBState = $state({ db: {} as Database })
export const selIdState = $state({ selId: -1 })
export const ScrollToMessageStore = $state({ value: -1 })

// Traditional stores (legacy, still used)
export const selectedCharID = writable(-1)
export const settingsOpen = writable(false)
export const DynamicGUI = writable(false)
```

### Key Stores

| Store | Purpose |
|-------|---------|
| `DBState` | Main database state (characters, settings, presets) |
| `selectedCharID` | Currently selected character index |
| `sideBarStore` | Sidebar visibility |
| `settingsOpen` | Settings panel visibility |
| `DynamicGUI` | Mobile/desktop layout mode |
| `CharEmotion` | Character emotion states |
| `loadedStore` | App loaded state |
| `alertStore` | Alert/notification state |

### Accessing Database

```typescript
import { getDatabase, setDatabase, getCurrentCharacter } from './storage/database.svelte'
import { DBState } from './stores.svelte'

// Read-only access
const db = getDatabase()

// Direct reactive access (Svelte 5)
const char = DBState.db.characters[index]

// Get snapshot (for passing to non-reactive functions)
const snapshot = getDatabase({ snapshot: true })
```

## File Naming Conventions

- `.svelte.ts` - Files using Svelte 5 runes (`$state`, `$derived`, `$effect`)
- `.ts` - Standard TypeScript files
- Use camelCase for file names

## Parser System (`parser.svelte.ts`)

The parser handles template syntax in prompts and messages:

```typescript
import { risuChatParser } from './process/scripts'

// Parse template variables
const parsed = risuChatParser(template, { chara: character })
```

### Common Template Variables

- `{{char}}` - Character name
- `{{user}}` - User name
- `{{random::a::b::c}}` - Random selection
- `{{time}}`, `{{date}}` - Current time/date
- `{{getvar::name}}`, `{{setvar::name::value}}` - Chat variables
- `{{position::location}}` - Lorebook injection point

## Platform Detection (`platform.ts`)

```typescript
import { isTauri, isCapacitor, isNodeServer, isWeb } from './platform'

if (isTauri) {
    // Desktop-specific code
}
```

## Common Patterns

### Safe Structured Clone

Use the `safeStructuredClone` helper from `util.ts` for deep cloning:

```typescript
import { safeStructuredClone } from './util'

const copy = safeStructuredClone(original)
```

### UUID Generation

```typescript
import { v4 } from 'uuid'

const id = v4()
```

## Related Documentation

- [Root CLAUDE.md](../../CLAUDE.md) - Project overview
- [plugins.md](../../plugins.md) - Plugin development guide
- [AGENTS.md](../../AGENTS.md) - AI assistant documentation
