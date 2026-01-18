# RisuAI Codebase Audit - Implementation Plan

## Completed Tasks

### Phase 1: Quick Wins (Partially Complete)

#### Empty Catch Blocks - DONE
Added error logging/comments to 22 empty catch blocks in:
- `src/ts/gui/colorscheme.ts` (3 instances)
- `src/ts/bootstrap.ts` (5 instances)
- `src/ts/kei/backup.ts`
- `src/ts/storage/accountStorage.ts`
- `src/ts/storage/autoStorage.ts`
- `src/ts/process/models/local.ts`
- `src/ts/process/scriptings.ts`
- `src/ts/plugins/apiV3/v3.ts`
- `src/ts/process/coldstorage.svelte.ts`
- `src/ts/process/templates/jsonSchema.ts`
- `src/ts/process/prompt.ts`
- `src/ts/process/mcp/mcplib.ts`
- `src/ts/process/request/openAI.ts` (2 instances)
- `src/ts/parser.svelte.ts`
- `src/ts/process/command.ts` (2 instances)

#### Console.log Removal - DONE
Removed debug console.log statements from:
- `src/ts/bootstrap.ts`
- `src/ts/process/command.ts`
- `src/ts/plugins/plugins.ts`
- `src/ts/storage/autoStorage.ts`
- `src/ts/parser.svelte.ts`
- `src/ts/characterCards.ts`
- `src/ts/util.ts`
- `src/ts/stores.svelte.ts`
- `src/ts/process/lorebook.svelte.ts`

### Phase 2: Plugin API Cleanup (Partially Complete)

#### Deprecation Warning in UI - DONE
- Updated `pluginV2Warning` message in `src/lang/en.ts` with deprecation timeline
- Added console warning in `loadV2Plugin()` function in `src/ts/plugins/plugins.ts`

---

## Remaining Tasks

### Phase 1: Quick Wins (Remaining)

#### Extract Magic Numbers to Constants
Files with hardcoded values that should be extracted:
- `src/ts/storage/database.svelte.ts` - `maxContext: 4000`, `maxResponse: 500`, `temperature: 80`
- `src/ts/process/` files - `insertorder: 100`, `truncation_length: 2048`
- Create a `src/ts/constants.ts` file for shared magic numbers

### Phase 2: Plugin API Cleanup (Remaining)

#### Update Migration Guide
- Update deprecation schedule in `src/ts/plugins/migrationGuide.md` with specific dates:
  - V2.0 removal: Q3 2026
  - V2.1 removal: Q4 2026
- Add security concerns section
- Add migration help resources

#### Add Deprecation Warnings to Other Languages
Update `pluginV2Warning` in:
- `src/lang/ko.ts`
- `src/lang/cn.ts`
- `src/lang/zh-Hant.ts`
- `src/lang/vi.ts`
- `src/lang/de.ts`
- `src/lang/es.ts`

### Phase 3: Memory System Consolidation

#### Audit Memory System Usage
Check which memory systems are actually used:
- `src/ts/process/memory/hypamemory.ts` (242 lines) - Original
- `src/ts/process/memory/hypamemoryv2.ts` (417 lines) - V2 extension
- `src/ts/process/memory/hypav2.ts` (668 lines) - Marked legacy
- `src/ts/process/memory/supaMemory.ts` (431 lines) - Unclear status
- `src/ts/process/memory/hanuraiMemory.ts` (102 lines) - Minimal usage
- `src/ts/process/memory/hypav3.ts` (1,934 lines) - Current implementation

#### Consolidate to hypav3
After audit, remove unused memory implementations and update imports.

### Phase 4: Type Safety

#### Replace Critical `any` Types
Priority locations:
- `src/ts/stores.svelte.ts:107` - `db: {} as any as Database`
- `src/ts/process/request/request.ts` - Multiple `res.data as any`
- `src/ts/plugins/plugins.ts:610,617,627` - `safeGlobalThis: {} as any`

#### Add Optional Chaining
- `src/ts/process/index.svelte.ts:138` - Deep property access
- `src/ts/globalApi.svelte.ts:396-408` - Direct property access on potentially undefined

#### Resolve @ts-expect-error Suppressions
- `src/ts/plugins/plugins.ts:644-685` - 6 instances
- `src/ts/storage/risuSave.ts:33,38` - Polyfill incompatibilities
- `src/ts/process/mcp/mcplib.ts:202` - JsonRPC assumptions

### Phase 5: Refactoring Large Files

#### Split TriggerList2.svelte (4,110 lines)
Extract into subcomponents:
- TriggerConditionEditor.svelte
- TriggerActionEditor.svelte
- TriggerListItem.svelte
- TriggerTypeSelector.svelte

#### Extract Helper Modules
From `src/ts/triggers.ts` (2,795 lines):
- triggerConditions.ts
- triggerActions.ts
- triggerExecutor.ts

From `src/ts/cbs.ts` (2,458 lines):
- cbsParser.ts
- cbsExecutor.ts
- cbsBuiltins.ts

From `src/ts/storage/database.svelte.ts` (2,344 lines):
- databaseMigration.ts
- databaseDefaults.ts
- databaseValidation.ts

### Phase 6: Additional Cleanup

#### Remove Deprecated Claude Models
In `src/ts/model/providers/anthropic.ts`:
- Remove Claude v1.x series (lines 298-362)
- Remove Claude 2.x series (lines 269-297)
- These use `LLMFormat.AnthropicLegacy` and may no longer be callable

#### Fix Unbounded Global State
- `src/ts/globalApi.svelte.ts:65` - Add limit to `fetchLog[]`
- `src/ts/plugins/plugins.ts:64` - Clear `updateCache` Map periodically
- `src/ts/globalApi.svelte.ts:99-107` - Add file cache size limit

#### Add Event Listener Cleanup
- `src/ts/stores.svelte.ts:105` - Clean up resize listener
- `src/ts/hotkey.ts:11` - Clean up keydown listener

---

## Verification Steps

After implementing all changes:
1. Run `pnpm check` for type errors
2. Test plugin loading for V2.1 and V3.0 plugins
3. Verify memory systems work correctly
4. Test on all platforms (web, Tauri, mobile)
5. Run existing test suite

---

## Notes

- TypeScript diagnostic errors shown during editing are mostly about missing module declarations - these are development tooling issues, not actual code problems
- The codebase uses Svelte 5 runes (`$state`, `$derived`, `$effect`) which the LSP may not fully recognize
- Buffer/Uint8Array type incompatibilities are common and may need investigation
