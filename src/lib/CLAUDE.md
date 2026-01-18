# UI Components (`/src/lib`)

This directory contains all Svelte UI components for RisuAI, organized by feature area. Components use Svelte 5 runes and Tailwind CSS 4.

## Directory Structure

| Directory | Purpose |
|-----------|---------|
| `ChatScreens/` | Chat interface and message display |
| `UI/` | Reusable UI primitives and layouts |
| `UI/GUI/` | Form inputs (TextInput, CheckInput, etc.) |
| `UI/NewGUI/` | Updated GUI components |
| `UI/Realm/` | Realm Hub components |
| `Setting/` | Settings panels and pages |
| `SideBars/` | Sidebar components (Scripts, LoreBook) |
| `Others/` | Miscellaneous components (alerts, modals) |
| `Mobile/` | Mobile-specific UI |
| `Playground/` | Development testing features |
| `VisualNovel/` | Visual novel mode components |
| `LiteUI/` | Lightweight UI variant |

## Theme Modes

The app supports multiple UI modes controlled by `DBState.db.theme`:

| Theme | Description |
|-------|-------------|
| `classic` | Standard desktop layout |
| `waifu` | Character image sidebar (WaifuLike) |
| `waifuMobile` | Mobile waifu layout |
| Visual Novel | Fullscreen VN mode via `ShowVN` store |

## Svelte 5 Patterns

### Runes Usage

```svelte
<script lang="ts">
    import { DBState, selectedCharID } from 'src/ts/stores.svelte'

    // Local reactive state
    let openChatList = $state(false)
    let bgImg = $state('')

    // Effects
    $effect.pre(() => {
        // Runs before DOM updates
        bgImg = await getCustomBackground(DBState.db.customBackground)
    })

    // Access global state
    const char = DBState.db.characters[$selectedCharID]
</script>
```

### Two-Way Binding with Stores

```svelte
<!-- Using store subscriptions -->
{#if $selectedCharID >= 0}
    <!-- Content when character selected -->
{/if}

<!-- Binding to component -->
<DefaultChatScreen bind:openChatList bind:openModuleList />
```

## Key Components

### Chat Interface

| Component | Purpose |
|-----------|---------|
| `ChatScreen.svelte` | Main chat layout with theme switching |
| `DefaultChatScreen.svelte` | Standard chat display |
| `Chat.svelte` | Single message component |
| `Chats.svelte` | Message list container |
| `ChatBody.svelte` | Chat content wrapper |
| `AssetInput.svelte` | File/image input for chat |
| `EmotionBox.svelte` | Character emotion display |

### UI Primitives (`UI/GUI/`)

| Component | Purpose |
|-----------|---------|
| `TextInput.svelte` | Text input with styling |
| `TextAreaInput.svelte` | Multi-line text input |
| `NumberInput.svelte` | Numeric input |
| `SliderInput.svelte` | Range slider |
| `CheckInput.svelte` | Checkbox |
| `SelectInput.svelte` | Dropdown select |
| `OptionInput.svelte` | Radio options |
| `ColorInput.svelte` | Color picker |
| `Button.svelte` | Styled button |
| `Portal.svelte` | Render children outside component tree |

### Settings Pages (`Setting/Pages/`)

| Component | Purpose |
|-----------|---------|
| `BotSettings.svelte` | AI model settings |
| `PromptSettings.svelte` | Prompt templates |
| `DisplaySettings.svelte` | UI customization |
| `PluginSettings.svelte` | Plugin management |
| `PersonaSettings.svelte` | User personas |
| `AdvancedSettings.svelte` | Advanced options |

### Sidebars (`SideBars/`)

| Component | Purpose |
|-----------|---------|
| `Sidebar.svelte` | Main sidebar container |
| `LoreBook/` | Lorebook editor components |
| `Scripts/` | Regex and trigger editors |
| `CharConfig.svelte` | Character configuration |

## Styling Conventions

### Tailwind CSS Classes

```svelte
<input
    class="border border-darkborderc peer focus:border-borderc
           rounded-md shadow-xs text-textcolor bg-transparent
           focus:ring-borderc focus:ring-2 focus:outline-hidden
           transition-colors duration-200"
    class:text-sm={size === 'sm'}
    class:w-full={fullwidth}
/>
```

### CSS Custom Properties (Theming)

Key color variables used:
- `textcolor` - Primary text
- `textcolor2` - Secondary text
- `borderc` - Border color
- `darkborderc` - Darker border
- `bgcolor` - Background

### Conditional Classes

```svelte
<div
    class:mb-4={marginBottom}
    class:mt-4={marginTop}
    class:w-full={fullwidth}
    class:text-textcolor2={disabled}
>
```

## Responsive Design

Use the `DynamicGUI` store for responsive layouts:

```svelte
<script>
    import { DynamicGUI } from 'src/ts/stores.svelte'
</script>

{#if $DynamicGUI}
    <!-- Mobile layout -->
{:else}
    <!-- Desktop layout -->
{/if}
```

## Adding New Components

1. Create `.svelte` file in appropriate directory
2. Use `lang="ts"` in script tag
3. Import stores from `src/ts/stores.svelte`
4. Use Tailwind for styling
5. Support theme colors via CSS variables

```svelte
<script lang="ts">
    import { DBState } from 'src/ts/stores.svelte'

    interface Props {
        value: string
        disabled?: boolean
    }

    let { value = $bindable(), disabled = false }: Props = $props()
</script>

<div class="border border-borderc rounded-md p-2">
    <input bind:value {disabled} class="bg-transparent text-textcolor" />
</div>
```

## Related Documentation

- [TypeScript CLAUDE.md](../ts/CLAUDE.md) - State management and stores
- [Root CLAUDE.md](../../CLAUDE.md) - Project overview
