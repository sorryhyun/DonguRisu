# Model Integrations (`/src/ts/model`)

This directory defines LLM provider configurations, model definitions, and provider-specific utilities for RisuAI.

## Directory Structure

| File | Purpose |
|------|---------|
| `types.ts` | Core enums and interfaces (LLMFlags, LLMProvider, LLMModel) |
| `modellist.ts` | Combined model list and exports |
| `ooba.ts` | Text Generation WebUI (Ooba) parameters |
| `openrouter.ts` | OpenRouter model fetching |
| `providers/openai.ts` | OpenAI model definitions |
| `providers/anthropic.ts` | Anthropic Claude definitions |
| `providers/google.ts` | Google Gemini definitions |

## Core Types (`types.ts`)

### LLMModel Interface

```typescript
interface LLMModel {
    id: string              // Model identifier (e.g., 'gpt-4o')
    name: string            // Display name
    shortName?: string      // Abbreviated name
    internalID?: string     // Provider's internal ID if different
    provider: LLMProvider   // Provider enum value
    format: LLMFormat       // Request format type
    flags: LLMFlags[]       // Capability flags
    parameters: Parameter[] // Supported parameters
    tokenizer: LLMTokenizer // Token counting method
    recommended?: boolean   // Show in recommended list
    keyIdentifier?: string  // API key lookup key
    endpoint?: string       // Custom endpoint URL
}
```

### LLMProvider Enum

```typescript
enum LLMProvider {
    OpenAI,      // api.openai.com
    Anthropic,   // api.anthropic.com
    GoogleCloud, // Gemini API
    VertexAI,    // Google Vertex AI
    AsIs,        // Custom/passthrough
    Mistral,     // MistralAI
    NovelList,   // NovelList
    Cohere,      // Cohere
    NovelAI,     // NovelAI
    WebLLM,      // Browser-based LLM
    Horde,       // AI Horde
    AWS,         // AWS Bedrock
    DeepSeek,    // DeepSeek
    DeepInfra,   // DeepInfra
    Echo         // Testing/development
}
```

### LLMFlags Enum

Model capability flags:

| Flag | Description |
|------|-------------|
| `hasImageInput` | Supports vision/image input |
| `hasAudioInput` | Supports audio input |
| `hasPrefill` | Supports assistant prefill |
| `hasCache` | Supports prompt caching |
| `hasFullSystemPrompt` | System prompt can appear anywhere |
| `hasFirstSystemPrompt` | System prompt must be first |
| `hasStreaming` | Supports streaming responses |
| `requiresAlternateRole` | Must alternate user/assistant |
| `mustStartWithUserInput` | First message must be user |
| `claudeThinking` | Supports Claude thinking mode |
| `geminiThinking` | Supports Gemini thinking mode |
| `deepSeekThinkingInput` | DeepSeek reasoning input |
| `deepSeekThinkingOutput` | DeepSeek reasoning output |

### LLMFormat Enum

Request format types:

| Format | Description |
|--------|-------------|
| `OpenAICompatible` | OpenAI chat completions API |
| `OpenAILegacyInstruct` | OpenAI instruct endpoint |
| `OpenAIResponseAPI` | OpenAI responses API |
| `Anthropic` | Claude Messages API |
| `AnthropicLegacy` | Older Claude API |
| `GoogleCloud` | Gemini API format |
| `VertexAIGemini` | Vertex AI format |
| `Mistral` | Mistral API format |
| `Cohere` | Cohere API format |
| `NovelAI` | NovelAI format |
| `Ooba` | Text Gen WebUI format |
| `Kobold` | KoboldAI format |
| `Ollama` | Ollama local format |
| `Plugin` | Custom plugin provider |
| `AWSBedrockClaude` | AWS Bedrock Claude |

### LLMTokenizer Enum

Tokenizer selection for token counting:

```typescript
enum LLMTokenizer {
    Unknown,           // Fallback estimation
    tiktokenCl100kBase,// GPT-4, GPT-3.5
    tiktokenO200Base,  // GPT-4o
    Mistral,
    Llama,
    Llama3,
    NovelAI,
    Claude,
    GoogleCloud,
    Cohere,
    DeepSeek,
    Local              // WebLLM local model
}
```

## Parameter Sets

```typescript
// OpenAI-style parameters
const OpenAIParameters: Parameter[] = [
    'temperature', 'top_p', 'frequency_penalty', 'presence_penalty'
]

// GPT-5 extended parameters
const GPT5Parameters: Parameter[] = [
    ...OpenAIParameters, 'reasoning_effort', 'verbosity'
]

// Claude parameters
const ClaudeParameters: Parameter[] = [
    'temperature', 'top_k', 'top_p'
]
```

## Usage Example

```typescript
import { getModelInfo, LLMFlags, LLMProvider } from './model/modellist'

// Get model info by ID
const model = getModelInfo('gpt-4o')

// Check capabilities
if (model.flags.includes(LLMFlags.hasImageInput)) {
    // Model supports vision
}

// Check provider
if (model.provider === LLMProvider.Anthropic) {
    // Anthropic-specific handling
}
```

## Adding New Models

### To Provider File

```typescript
// In providers/openai.ts, anthropic.ts, or google.ts
export const MyProviderModels: LLMModel[] = [
    {
        name: 'New Model Name',
        id: 'model-id',
        shortName: 'Short',
        provider: LLMProvider.MyProvider,
        format: LLMFormat.OpenAICompatible,
        flags: [LLMFlags.hasFirstSystemPrompt, LLMFlags.hasStreaming],
        parameters: OpenAIParameters,
        tokenizer: LLMTokenizer.Unknown,
        recommended: true
    }
]
```

### To Model List

```typescript
// In modellist.ts
import { MyProviderModels } from './providers/myprovider'

export const LLMModels: LLMModel[] = [
    ...OpenAIModels,
    ...AnthropicModels,
    ...MyProviderModels,
    // ...
]
```

## Custom API / OpenRouter

For dynamic models (OpenRouter), models are fetched at runtime:

```typescript
import { openRouterModels } from './openrouter'

const models = await openRouterModels()
```

## Related Documentation

- [process/CLAUDE.md](../process/CLAUDE.md) - Request handling
- [Parent CLAUDE.md](../CLAUDE.md) - TypeScript core overview
