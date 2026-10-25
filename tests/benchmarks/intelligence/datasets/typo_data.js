// =============================================================================
// Benchmark Dataset: Realistic Typing Noise, Omission & Fat-Finger Errors
// =============================================================================

var TypoData = [
    { noisyInput: "notunn", expected: "নতুন", errorType: "Trailing Extra Consonant" },
    { noisyInput: "shbdo", expected: "শব্দ", errorType: "Vowel Omission" },
    { noisyInput: "ekhn", expected: "এখন", errorType: "Vowel Omission" },
    { noisyInput: "porikha", expected: "পরীক্ষা", errorType: "Phonetic Simplification" },
    { noisyInput: "amraa", expected: "আমরা", errorType: "Trailing Duplicate Vowel" },
    { noisyInput: "prthom", expected: "প্রথম", errorType: "Vowel Omission" },
    { noisyInput: "bhasa", expected: "ভাষা", errorType: "Aspiration / Sibilant Shift" },
    { noisyInput: "dhonnobaad", expected: "ধন্যবাদ", errorType: "Duplicate Vowel" },
    { noisyInput: "bides", expected: "বিদেশ", errorType: "Sibilant Simplification" },
    { noisyInput: "kormosuci", expected: "কর্মসূচি", errorType: "Sibilant Simplification" }
];
