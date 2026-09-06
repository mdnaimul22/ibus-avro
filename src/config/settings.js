// =============================================================================
// IBus Avro Settings & Configuration Constants (Single Source of Truth)
// =============================================================================

var Settings = {
    // Adaptive Suggestion History Limits
    PRUNE_KEY_LIMIT: 2000,
    PRUNE_KEEP_LIMIT: 1500,

    // Persistence Timing
    SAVE_DEBOUNCE_MS: 2000,

    // File Storage
    CANDIDATE_FILE_NAME: "/.candidate-selections.json",
    JSON_INDENT: 2,

    // GSettings Schema
    SCHEMA_ID: "com.omicronlab.avro"
};
