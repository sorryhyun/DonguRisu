# RisuAI Codebase Audit - Implementation Plan

## Completed Tasks

### Phase 1: Quick Wins ✅ COMPLETE

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

#### Extract Magic Numbers to Constants - DONE
Created `src/ts/constants.ts` with centralized defaults:
- LLM parameters (temperature, maxContext, maxResponse, penalties)
- Lorebook settings (depth, token budget, insert order)
- Memory system settings (HypaMemory, SupaMemory tokens)
- Request settings (timeout, retries)
- UI settings (zoom, icon size, animation speed)
- Image generation defaults (SD, NAI)
- Ooba settings (truncation_length, max_new_tokens)

Updated files to use constants:
- `src/ts/storage/database.svelte.ts`
- `src/ts/process/lorebook.svelte.ts`
- `src/ts/process/triggers.ts`
- `src/ts/process/mcp/risuaccess/characters.ts`
- `src/ts/process/mcp/risuaccess/modules.ts`

### Phase 2: Plugin API Cleanup ✅ COMPLETE

#### Deprecation Warning in UI - DONE
- Updated `pluginV2Warning` message in `src/lang/en.ts` with deprecation timeline
- Added console warning in `loadV2Plugin()` function in `src/ts/plugins/plugins.ts`

#### Update Migration Guide - DONE
Updated `src/ts/plugins/migrationGuide.md`:
- Added Security Concerns section explaining V2.x vulnerabilities
- Added specific deprecation dates (Q3 2026 for V2.0, Q4 2026 for V2.1)
- Added migration help resources

#### Add Deprecation Warnings to Other Languages - DONE
Added `pluginV2Warning` translations to:
- `src/lang/ko.ts` (Korean)
- `src/lang/cn.ts` (Simplified Chinese)
- `src/lang/zh-Hant.ts` (Traditional Chinese)
- `src/lang/de.ts` (German)
- `src/lang/es.ts` (Spanish)
- `src/lang/vi.ts` (Vietnamese)

### Phase 3: Memory System Consolidation ✅ AUDIT COMPLETE

#### Audit Memory System Usage - DONE
Memory system audit findings:
- `hypamemory.ts` (242 lines) - **CRITICAL: Foundation library, CANNOT REMOVE**
- `hypamemoryv2.ts` (417 lines) - Used internally by hypav3, keep for now
- `hypav2.ts` (668 lines) - **DEPRECATED: Can be removed with user migration to V3**
- `supaMemory.ts` (431 lines) - **ACTIVE: Default fallback, MUST KEEP**
- `hanuraiMemory.ts` (102 lines) - **ACTIVE: Small, focused, has config options, KEEP**
- `hypav3.ts` (1,934 lines) - **ACTIVE: Recommended current system, MUST KEEP**

Priority chain in index.svelte.ts: hanurai → hypav2 → hypav3 → supaMemory (fallback)

#### Future Work: Memory System Cleanup (Deferred)
Potential ~668 lines cleanup by removing hypav2.ts, but requires:
- User migration path to HypaV3 or supaMemory
- Data conversion utility for existing V2 data
- Removal from UI settings
- Deprecation notice and timeline

### Phase 4: Type Safety ✅ COMPLETE

#### Replace Critical `any` Types - DONE
- `src/ts/stores.svelte.ts:107` - Changed `as any as Database` to `as unknown as Database` with documentation
- Plugin sandbox `any` types are intentional for security layer (documented)
- API response `any` types are pragmatic for external APIs

#### Add Optional Chaining - DONE
- `src/ts/process/index.svelte.ts:138` - Refactored deep property access with local variables
- `src/ts/globalApi.svelte.ts:396-408` - Extracted `char` and `currentChat` variables with proper optional chaining

#### Resolve @ts-expect-error Suppressions - REVIEWED
All @ts-expect-error comments are justified and well-documented:
- Non-standard browser APIs (iOS standalone, Chrome extension, Tauri)
- Polyfill type mismatches (compression streams)
- Plugin sandbox wrappers (intentional for security)
- Test file mocks

### Phase 5: Refactoring Large Files (Deferred)

Large file refactoring deferred for future work:
- TriggerList2.svelte (4,110 lines)
- triggers.ts (2,795 lines)
- cbs.ts (2,458 lines)
- database.svelte.ts (2,344 lines)

### Phase 6: Additional Cleanup ✅ COMPLETE

#### Remove Deprecated Claude Models - DONE
Added `deprecated` field to `LLMModel` interface in `src/ts/model/types.ts`
Marked deprecated models in `src/ts/model/providers/anthropic.ts`:
- Claude 2.x series (claude-2.1, claude-2, claude-2-100k)
- Claude 1.x series (claude-1.2, claude-1.0, claude-v1, claude-v1-100k)
- Claude Instant series (claude-instant-v1, claude-instant-v1-100k, claude-instant-1.2)

#### Fix Unbounded Global State - DONE
- Added `MAX_HOT_RELOADING` limit (20) to hotReloading array
- Added helper functions: `addToHotReloading()`, `removeFromHotReloading()`, `clearHotReloading()`
- Updated `src/ts/plugins/plugins.ts` to use new helper functions

#### Add Event Listener Cleanup - DOCUMENTED
- `src/ts/stores.svelte.ts` - resize listener is intentionally permanent (app lifecycle)
- Added documentation comment explaining the design decision

---

## Verification Results

After implementing all changes:
1. ✅ `pnpm check` passes (only pre-existing RealmFrame.svelte error)
2. ✅ Type check passes for all modified files
3. ✅ Constants properly imported and used
4. ✅ Language translations added

---

## Summary of Changes

| Category | Files Modified | Changes |
|----------|---------------|---------|
| Constants | 6 files | Created constants.ts, updated defaults across codebase |
| Translations | 7 files | Added pluginV2Warning to all supported languages |
| Types | 2 files | Added deprecated flag to LLMModel, improved type assertions |
| Memory Audit | plan.md | Documented memory system status and recommendations |
| State Management | 2 files | Added hot-reload state management with limits |
| Documentation | 2 files | Updated migration guide with dates, added security section |
| Model Definitions | 1 file | Marked 10 deprecated Claude models |

---

## Notes

- TypeScript diagnostic errors shown during editing are mostly about missing module declarations - these are development tooling issues, not actual code problems
- The codebase uses Svelte 5 runes (`$state`, `$derived`, `$effect`) which the LSP may not fully recognize
- Buffer/Uint8Array type incompatibilities are common and may need investigation
- Pre-existing RealmFrame.svelte type error is unrelated to this work
