# Data Persistence Layer (`/src/ts/storage`)

This directory handles all data persistence for RisuAI, including the database schema, multi-platform storage backends, and save file encoding.

## Key Files

| File | Purpose |
|------|---------|
| `database.svelte.ts` | Main database types and accessor functions |
| `autoStorage.ts` | Platform-aware storage abstraction |
| `risuSave.ts` | Save file encoding/decoding |
| `defaultPrompts.ts` | Default prompt templates |

## Storage Backends

| File | Platform | Description |
|------|----------|-------------|
| `opfsStorage.ts` | Web (modern) | Origin Private File System |
| `nodeStorage.ts` | Node.js | File system via Node |
| `mobileStorage.ts` | Capacitor | Mobile file system |
| `accountStorage.ts` | Cloud | RisuAI account sync |
| LocalForage | Web (fallback) | IndexedDB wrapper |

## AutoStorage Pattern

The `AutoStorage` class automatically selects the appropriate backend:

```typescript
import { AutoStorage } from './autoStorage'

const storage = new AutoStorage()
await storage.setItem('key', data)
const value = await storage.getItem('key')
const keys = await storage.keys()
await storage.removeItem('key')
```

### Backend Selection Priority

1. Account Storage (if logged in and syncing)
2. Mobile Storage (if Capacitor)
3. Node Storage (if Node.js server)
4. OPFS Storage (if browser supports OPFS)
5. LocalForage (fallback)

## Database Schema (`database.svelte.ts`)

### Core Types

```typescript
interface Database {
    characters: (character | groupChat)[]
    apiType: string
    aiModel: string
    botPresets: botPreset[]
    botPresetsId: number
    modules: RisuModule[]
    // ... many more fields
}

interface character {
    type?: "character"
    name: string
    chats: Chat[]
    chaId: string
    globalLore: loreBook[]
    customscript: customscript[]
    triggerscript: triggerscript[]
    // ... more fields
}

interface Chat {
    message: Message[]
    note: string
    name: string
    localLore: loreBook[]
    hypaV3Data?: SerializableHypaV3Data
}

interface Message {
    role: 'user' | 'char'
    data: string
    chatId?: string
    time?: number
    generationInfo?: MessageGenerationInfo
}
```

### Database Accessors

```typescript
import {
    getDatabase,
    setDatabase,
    getCurrentCharacter,
    getCurrentChat,
    setCurrentChat
} from './database.svelte'

// Get database (reactive by default)
const db = getDatabase()

// Get snapshot for non-reactive use
const snapshot = getDatabase({ snapshot: true })

// Get current character
const char = getCurrentCharacter()

// Update current chat
setCurrentChat(modifiedChat)
```

### Bot Presets

```typescript
interface botPreset {
    name?: string
    apiType?: string
    aiModel?: string
    mainPrompt: string
    jailbreak: string
    temperature: number
    maxContext: number
    maxResponse: number
    promptTemplate?: PromptItem[]
    // ... many more fields
}

// Save/load presets
import { saveCurrentPreset, changeToPreset, downloadPreset, importPreset } from './database.svelte'

saveCurrentPreset()
changeToPreset(presetId)
await downloadPreset(id, 'risupreset')
await importPreset()
```

## Save File Format (`risuSave.ts`)

### Magic Headers

| Header | Version | Description |
|--------|---------|-------------|
| `RISUSAVE\0` | Current | New block-based format |
| Version 9 | Legacy | Stream compressed |
| Version 8 | Legacy | fflate compressed |
| Version 7 | Legacy | Uncompressed msgpack |

### Block Types

```typescript
enum RisuSaveType {
    CONFIG = 0,              // Save file config
    ROOT = 1,                // Main database (without characters)
    CHARACTER_WITH_CHAT = 2, // Character + chat data
    CHAT = 3,                // Chat only
    BOTPRESET = 4,           // Bot presets
    MODULES = 5,             // RisuModules
    REMOTE = 6               // Remote reference
}
```

### Encoding/Decoding

```typescript
import { encodeRisuSaveLegacy, decodeRisuSave } from './risuSave'

// Encode with compression
const encoded = encodeRisuSaveLegacy(database, 'compression')

// Decode
const database = await decodeRisuSave(encodedData)
```

## Data Migration

The `setDatabase()` function handles schema migrations with null-coalescing defaults:

```typescript
// In setDatabase():
data.hypaV3Presets ??= [createHypaV3Preset("Default", {})]
data.hotkeys ??= safeStructuredClone(defaultHotkeys)
data.customModels ??= []
```

## Character Cards

### Supported Formats

- `.risum` - RisuAI character (JSON)
- `.risup` - RisuAI preset (msgpack + encryption)
- `.charx` - Character exchange format
- `.png` - Character card embedded in PNG
- `.json` - Various JSON formats

### Import/Export

```typescript
import { downloadPreset, importPreset } from './database.svelte'

// Export preset
await downloadPreset(presetId, 'risupreset')

// Import preset
await importPreset(file)
```

## Storage Keys

Assets are stored with keys like:

- `database/database.bin` - Main database
- `assets/{uuid}` - Asset files (images, etc.)
- `chars/{chaId}` - Character data

## Related Documentation

- [Parent CLAUDE.md](../CLAUDE.md) - TypeScript core overview
- [Root CLAUDE.md](../../CLAUDE.md) - Project overview
