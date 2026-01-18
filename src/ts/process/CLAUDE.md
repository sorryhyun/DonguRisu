# Chat Processing Pipeline (`/src/ts/process`)

This directory contains the core chat processing system, including message handling, API requests, memory systems, and integrations with various AI providers and tools.

## Entry Point

### `index.svelte.ts` - Chat Processing Orchestration

The main `sendChat()` function orchestrates the entire chat pipeline:

```typescript
import { sendChat, doingChat, chatProcessStage, abortChat } from './index.svelte'

// Send a chat message
const success = await sendChat(chatProcessIndex, {
    signal: abortController.signal,
    continue: false,  // true for continue generation
    preview: false    // true for dry run
})

// Check processing stage (1-4)
chatProcessStage.subscribe(stage => {
    // 1: Formatting prompts
    // 2: Memory processing
    // 3: API request
    // 4: Post-processing
})
```

### Key Interfaces

```typescript
interface OpenAIChat {
    role: 'system' | 'user' | 'assistant' | 'function'
    content: string
    memo?: string
    name?: string
    multimodals?: MultiModal[]
    thoughts?: string[]
    cachePoint?: boolean
}

interface MultiModal {
    type: 'image' | 'video' | 'audio'
    base64: string
    height?: number
    width?: number
}
```

## Directory Structure

| Directory/File | Purpose |
|----------------|---------|
| `request/` | API request handlers |
| `memory/` | Memory/summarization systems |
| `models/` | Provider-specific model handling |
| `templates/` | Prompt templates and formatting |
| `mcp/` | Model Context Protocol support |
| `files/` | File handling (inlays, multisend) |
| `embedding/` | Vector embeddings |
| `lorebook.svelte.ts` | Lorebook/world info management |
| `scripts.ts` | Script/template processing |
| `triggers.ts` | Event triggers |
| `tts.ts` | Text-to-speech |
| `stableDiff.ts` | Stable Diffusion integration |

## Request System (`/request`)

### `request.ts` - Main Request Handler

```typescript
import { requestChatData } from './request/request'

const response = await requestChatData({
    formated: formattedChats,
    biasString: biases,
    currentChar: character,
    useStreaming: true,
    isGroupChat: false,
    continue: false
}, 'model', abortSignal)

// Response types
if (response.type === 'streaming') {
    const reader = response.result.getReader()
    // Handle streaming
}
if (response.type === 'success') {
    const text = response.result
}
if (response.type === 'fail') {
    const error = response.result
}
```

### Request Mode Types

| Mode | Description |
|------|-------------|
| `model` | Main chat model |
| `submodel` | Auxiliary model (emotion, etc.) |
| `memory` | Memory summarization |
| `emotion` | Emotion detection |
| `translate` | Translation |
| `otherAx` | Other auxiliary |

## Memory Systems (`/memory`)

### HypaV3 (Recommended)

The latest memory system with summarization and similarity search:

```typescript
import { hypaMemoryV3 } from './memory/hypav3'

const result = await hypaMemoryV3(
    chats, currentTokens, maxContextTokens,
    room, character, tokenizer
)
```

### Memory System Comparison

| System | Key Feature | Config Field |
|--------|-------------|--------------|
| HypaV3 | Summarization + similarity | `db.hypaV3` |
| HypaV2 | Vector embedding memory | `db.hypav2` |
| SupaMemory | Basic summarization | `db.supaModelType` |
| Hanurai | Split memory processing | `db.hanuraiEnable` |

### HypaV3 Settings

```typescript
interface HypaV3Settings {
    summarizationModel: string
    summarizationPrompt: string
    memoryTokensRatio: number
    extraSummarizationRatio: number
    maxChatsPerSummary: number
    recentMemoryRatio: number
    similarMemoryRatio: number
    enableSimilarityCorrection: boolean
    preserveOrphanedMemory: boolean
}
```

## MCP Support (`/mcp`)

Model Context Protocol integration for tool usage:

| File | Purpose |
|------|---------|
| `mcp.ts` | Main MCP orchestration |
| `mcplib.ts` | MCP protocol definitions |
| `internalmcp.ts` | Internal tool handlers |
| `risuaccess/` | RisuAI-specific MCP tools |

```typescript
import { getTools } from './mcp/mcp'

const tools: MCPTool[] = await getTools()
```

## Script Processing (`scripts.ts`)

Template variable parsing and script execution:

```typescript
import { risuChatParser, processScript, processScriptFull } from './scripts'

// Parse template variables
const parsed = risuChatParser(template, {
    chara: character,
    runVar: true
})

// Process with scripts
const result = await processScriptFull(
    chatroom, text, 'editoutput', messageIndex
)
```

## Lorebook System (`lorebook.svelte.ts`)

World info and lorebook management:

```typescript
import { loadLoreBookV3Prompt } from './lorebook.svelte'

const lorePrompt = await loadLoreBookV3Prompt()
// lorePrompt.actives contains matched lorebook entries
```

### Lorebook Entry Positions

| Position | Description |
|----------|-------------|
| `''` (empty) | Normal insertion |
| `after_desc` | After character description |
| `before_desc` | Before character description |
| `depth` | At specific depth in chat |
| `reverse_depth` | Depth from end of chat |
| `pt_*` | Custom position marker |

## Triggers (`triggers.ts`)

Event-based trigger system:

```typescript
import { runTrigger } from './triggers'

const result = await runTrigger(character, 'start', { chat })
const result = await runTrigger(character, 'output', { chat })
```

### Trigger Types

- `start` - Before chat processing
- `output` - After response received
- `manual` - User-triggered

## Templates (`/templates`)

| File | Purpose |
|------|---------|
| `templates.ts` | Built-in preset templates |
| `chatTemplate.ts` | Chat format templates (ChatML, etc.) |
| `getRecommended.ts` | Recommended settings per model |
| `jsonSchema.ts` | JSON schema handling |

## Processing Flow

1. **Format Stage** - Build prompt from template, description, lorebook
2. **Memory Stage** - Process memory systems (HypaV3, etc.)
3. **Request Stage** - Send to API provider
4. **Post-process Stage** - Script processing, emotion, TTS

## Related Documentation

- [Parent CLAUDE.md](../CLAUDE.md) - TypeScript core overview
- [model/CLAUDE.md](../model/CLAUDE.md) - LLM provider details
