## Project Overview

DonguRisu is a fork of [RisuAI](https://github.com/kwaroran/RisuAI), a cross-platform AI chatting application built with:
- **Frontend**: Svelte 5 + TypeScript
- **Desktop**: Tauri 2.5 (Rust backend)
- **Mobile**: Capacitor 5.7 (Android)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm

## Documentation Map

| Path | Description |
|------|-------------|
| [`src/ts/CLAUDE.md`](./src/ts/CLAUDE.md) | Core TypeScript: stores, state management, utilities |
| [`src/ts/process/CLAUDE.md`](./src/ts/process/CLAUDE.md) | Chat processing: requests, memory, MCP, templates |
| [`src/ts/storage/CLAUDE.md`](./src/ts/storage/CLAUDE.md) | Data persistence: database, multi-platform storage |
| [`src/ts/plugins/CLAUDE.md`](./src/ts/plugins/CLAUDE.md) | Plugin system quick reference |
| [`src/ts/model/CLAUDE.md`](./src/ts/model/CLAUDE.md) | LLM provider integrations and model definitions |
| [`src/lib/CLAUDE.md`](./src/lib/CLAUDE.md) | UI components and Svelte 5 patterns |
| [`src-tauri/CLAUDE.md`](./src-tauri/CLAUDE.md) | Tauri desktop backend (Rust) |
| [`android/CLAUDE.md`](./android/CLAUDE.md) | Capacitor Android mobile |
| [`plugins.md`](./plugins.md) | Complete plugin development guide |
| [`AGENTS.md`](./AGENTS.md) | AI assistant documentation |

## Quick Start

```bash
# Development
pnpm dev              # Web dev server
pnpm tauri dev        # Desktop dev

# Production
pnpm build            # Web build
pnpm tauribuild && pnpm tauri build  # Desktop build

# Checks
pnpm check            # Type checking
```

## Directory Structure

```
risuai/
├── src/
│   ├── ts/              # TypeScript business logic
│   │   ├── storage/     # Data persistence
│   │   ├── process/     # Chat processing pipeline
│   │   ├── plugins/     # Plugin system (v3.0)
│   │   └── model/       # LLM integrations
│   ├── lib/             # Svelte UI components
│   └── lang/            # Internationalization
├── src-tauri/           # Tauri desktop backend
├── android/             # Capacitor mobile
└── server/              # Self-hosting servers
```

## Development Conventions

### File Naming
- `.svelte.ts` - Svelte 5 files with runes ($state, $derived, $effect)
- `.svelte` - Svelte component files
- camelCase for all file names

### State Management
- Uses Svelte 5 Runes: `$state`, `$derived`, `$effect`
- Key stores in `src/ts/stores.svelte.ts`:
  - `DBState` - Main database state
  - `selectedCharID` - Current character
  - `DynamicGUI` - Responsive layout mode

### Code Style
- Prettier for formatting
- Run `pnpm check` before commits

## Supported AI Providers

OpenAI, Anthropic (Claude), Google (Gemini), DeepSeek, DeepInfra, Mistral, OpenRouter, Cohere, NovelAI, AI Horde, Ollama, Ooba, AWS Bedrock, custom providers via plugins.

## Deployment Targets

| Platform | Format |
|----------|--------|
| Web | Vite static site |
| Desktop | Tauri (Windows/macOS/Linux) |
| Mobile | Capacitor (Android) |
| Server | Node.js or Hono |
| Docker | Container (port 6001) |

## i18n

Languages: English (en), Korean (ko), Chinese Simplified (cn), Chinese Traditional (zh-Hant), Vietnamese (vi), German (de), Spanish (es).

Files in `/src/lang/`.

## Contribution Guidelines

1. Follow existing coding style
2. Run `pnpm check` before pull requests
3. Format with Prettier before committing
