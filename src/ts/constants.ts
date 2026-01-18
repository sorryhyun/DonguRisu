/**
 * Application-wide constants for default values and magic numbers.
 * These values are used across the codebase and should be changed here
 * rather than at individual usage sites.
 */

// ============================================================================
// LLM Parameters - Default values for AI model configuration
// ============================================================================

/** Default temperature value (scaled 0-100, where 80 = 0.8) */
export const DEFAULT_TEMPERATURE = 80

/** Default maximum context size in tokens */
export const DEFAULT_MAX_CONTEXT = 4000

/** Default maximum response size in tokens */
export const DEFAULT_MAX_RESPONSE = 500

/** Default maximum response for presets (smaller than database default) */
export const DEFAULT_PRESET_MAX_RESPONSE = 300

/** Default frequency penalty (scaled 0-100, where 70 = 0.7) */
export const DEFAULT_FREQUENCY_PENALTY = 70

/** Default presence penalty (scaled 0-100, where 70 = 0.7) */
export const DEFAULT_PRESENCE_PENALTY = 70

/** Default top_p value for sampling */
export const DEFAULT_TOP_P = 1

/** Default top_k value for sampling */
export const DEFAULT_TOP_K = 0

/** Default repetition penalty */
export const DEFAULT_REPETITION_PENALTY = 1

/** Default min_p value */
export const DEFAULT_MIN_P = 0

/** Default top_a value */
export const DEFAULT_TOP_A = 0

// ============================================================================
// Lorebook Settings
// ============================================================================

/** Default lorebook scan depth (number of messages to scan) */
export const DEFAULT_LOREBOOK_DEPTH = 5

/** Default lorebook token budget */
export const DEFAULT_LOREBOOK_TOKEN = 800

/** Default lorebook entry insert order/priority */
export const DEFAULT_LOREBOOK_INSERT_ORDER = 100

// ============================================================================
// Memory System Settings
// ============================================================================

/** Default allocated tokens for HypaMemory */
export const DEFAULT_HYPA_ALLOCATED_TOKENS = 3000

/** Default chunk size for HypaMemory */
export const DEFAULT_HYPA_CHUNK_SIZE = 3000

/** Default maximum chunk size for SupaMemory */
export const DEFAULT_SUPA_CHUNK_SIZE = 1200

/** Default hanurai tokens */
export const DEFAULT_HANURAI_TOKENS = 1000

// ============================================================================
// Request Settings
// ============================================================================

/** Default request timeout in seconds */
export const DEFAULT_REQUEST_TIMEOUT = 120

/** Default number of request retries */
export const DEFAULT_REQUEST_RETRIES = 2

// ============================================================================
// UI Settings
// ============================================================================

/** Default zoom size percentage */
export const DEFAULT_ZOOM_SIZE = 100

/** Default icon size percentage */
export const DEFAULT_ICON_SIZE = 100

/** Default waifu width percentage */
export const DEFAULT_WAIFU_WIDTH = 100

/** Default line height multiplier */
export const DEFAULT_LINE_HEIGHT = 1.25

/** Default animation speed in seconds */
export const DEFAULT_ANIMATION_SPEED = 0.4

/** Default asset max difference */
export const DEFAULT_ASSET_MAX_DIFFERENCE = 4

/** Default settings close button size in pixels */
export const DEFAULT_SETTINGS_CLOSE_BUTTON_SIZE = 24

// ============================================================================
// Image Generation Settings
// ============================================================================

/** Default Stable Diffusion steps */
export const DEFAULT_SD_STEPS = 30

/** Default Stable Diffusion CFG scale */
export const DEFAULT_SD_CFG = 7

/** Default SD image width */
export const DEFAULT_SD_WIDTH = 512

/** Default SD image height */
export const DEFAULT_SD_HEIGHT = 512

/** Default NAI image width */
export const DEFAULT_NAI_WIDTH = 1024

/** Default NAI image height */
export const DEFAULT_NAI_HEIGHT = 1024

/** Default NAI steps */
export const DEFAULT_NAI_STEPS = 28

/** Default NAI scale */
export const DEFAULT_NAI_SCALE = 5

// ============================================================================
// Ooba/TextGen Settings
// ============================================================================

/** Default max new tokens for Ooba */
export const DEFAULT_OOBA_MAX_NEW_TOKENS = 180

/** Default truncation length for Ooba */
export const DEFAULT_OOBA_TRUNCATION_LENGTH = 4096

// ============================================================================
// Translation Settings
// ============================================================================

/** Default translator max response tokens */
export const DEFAULT_TRANSLATOR_MAX_RESPONSE = 1000

// ============================================================================
// Miscellaneous
// ============================================================================

/** Default generation time multiplier */
export const DEFAULT_GEN_TIME = 1

/** Default comfy UI timeout in seconds */
export const DEFAULT_COMFY_TIMEOUT = 30
