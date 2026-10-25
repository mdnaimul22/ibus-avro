#!/usr/bin/env gjs
// =============================================================================
// Avro Cognitive & Intelligence Benchmark (AIS) Master Runner
// =============================================================================

imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');
imports.searchPath.unshift('./tests/benchmarks/intelligence/datasets');
imports.searchPath.unshift('./tests/benchmarks/intelligence/evaluators');

const GLib = imports.gi.GLib;
const Services = imports.services.index;

const corpusMod = imports.corpus_data;
const morphMod = imports.morphology_data;
const ambigMod = imports.ambiguity_data;
const typoMod = imports.typo_data;

const ksrEvaluator = imports.ksr_evaluator;
const adaptiveEvaluator = imports.adaptive_evaluator;
const morphologyEvaluator = imports.morphology_evaluator;
const ambiguityEvaluator = imports.ambiguity_evaluator;
const fuzzyEvaluator = imports.fuzzy_evaluator;

function formatPct(val) {
    return val.toFixed(1) + "%";
}

function runBenchmark() {
    print("\n\x1b[1;36m" + "=".repeat(68));
    print("        IBus Avro Cognitive & Intelligence Matrix (AIS)");
    print("=".repeat(68) + "\x1b[0m");
    print("\x1b[90m[*] Initializing sandboxed evaluation engines...\x1b[0m\n");

    var startTime = GLib.get_monotonic_time();

    // Sandbox Engine
    var engine = new Services.SuggestionEngine();
    engine._candidateSelections = {};
    engine._flushSave = function() {}; // sandbox in memory

    // 1. Evaluate KSR & Top-1/Top-3 Hit Rate
    print("\x1b[1;34m[1/5] Evaluating Keystroke Savings Rate (KSR) & Top-1 Hit Rate...\x1b[0m");
    var ksrResults = ksrEvaluator.evaluateKSR(engine, corpusMod.CorpusData);

    // 2. Evaluate Adaptive Learning & Noise Resilience
    print("\x1b[1;34m[2/5] Evaluating Adaptive Convergence Velocity & Noise Resilience...\x1b[0m");
    var adaptiveResults = adaptiveEvaluator.evaluateAdaptive(Services.SuggestionEngine);

    // 3. Evaluate Morphology & Suffix Boundaries
    print("\x1b[1;34m[3/5] Evaluating Morphological Inflection & Suffix Boundaries...\x1b[0m");
    var morphResults = morphologyEvaluator.evaluateMorphology(engine, morphMod.MorphologyData);

    // 4. Evaluate Orthographic Ambiguity & Homophones
    print("\x1b[1;34m[4/5] Evaluating Orthographic Ambiguity & Homophone Resolution...\x1b[0m");
    var ambigResults = ambiguityEvaluator.evaluateAmbiguity(engine, ambigMod.AmbiguityData);

    // 5. Evaluate Fuzzy Typo Recovery
    print("\x1b[1;34m[5/5] Evaluating Fuzzy Typo Elasticity & Fat-Finger Recovery...\x1b[0m");
    var fuzzyResults = fuzzyEvaluator.evaluateFuzzy(engine, typoMod.TypoData);

    var totalDurationMs = (GLib.get_monotonic_time() - startTime) / 1000;

    // Component Scores (0-100 each)
    var top1Score = ksrResults.top1HitRate;
    var top3Score = ksrResults.top3HitRate;
    var adaptScore = adaptiveResults.score;
    var morphScore = morphResults.score;
    var errorToleranceScore = (ambigResults.score * 0.5) + (fuzzyResults.score * 0.5);

    // Weighted Overall Avro Intelligence Score (AIS)
    var ais = (top1Score * 0.30) +
              (top3Score * 0.10) +
              (adaptScore * 0.20) +
              (morphScore * 0.20) +
              (errorToleranceScore * 0.20);

    var gradeTier = "";
    var gradeColor = "";
    if (ais >= 90) {
        gradeTier = "[S-Tier] World-Class Cognitive Engine 🌟";
        gradeColor = "\x1b[1;32m"; // Green
    } else if (ais >= 80) {
        gradeTier = "[A-Tier] Highly Intelligent Adaptive Engine 🚀";
        gradeColor = "\x1b[1;36m"; // Cyan
    } else if (ais >= 70) {
        gradeTier = "[B-Tier] Capable Phonetic IME 👍";
        gradeColor = "\x1b[1;33m"; // Yellow
    } else {
        gradeTier = "[C-Tier] Basic Script Transliteration ⚠️";
        gradeColor = "\x1b[1;31m"; // Red
    }

    // Print Rich Executive Dashboard
    print("\n\x1b[1;35m" + "═".repeat(68));
    print("                     EXECUTIVE SCORECARD");
    print("═".repeat(68) + "\x1b[0m");

    print("  \x1b[1mMetric Dimension\x1b[0m                          \x1b[1mResult\x1b[0m          \x1b[1mScore\x1b[0m");
    print("  " + "─".repeat(64));
    print("  1. Top-1 Suggestion Hit Rate        :   " + formatPct(ksrResults.top1HitRate) + "        \x1b[32m" + formatPct(top1Score) + "\x1b[0m");
    print("  2. Top-3 Suggestion Coverage        :   " + formatPct(ksrResults.top3HitRate) + "        \x1b[32m" + formatPct(top3Score) + "\x1b[0m");
    print("  3. Keystroke Savings Rate (KSR)     :   " + formatPct(ksrResults.ksr) + " (Early: " + ksrResults.earlyPredictions + "/" + ksrResults.totalWords + ")");
    print("  4. Adaptive Learning Convergence    :   " + adaptiveResults.convergenceCommits + " commit(s)    \x1b[32m" + formatPct(adaptiveResults.velocityScore) + "\x1b[0m");
    print("  5. Accidental Typo Resilience       :   " + (adaptiveResults.noiseResilience ? "Resilient" : "Vulnerable") + "      \x1b[32m" + formatPct(adaptiveResults.resilienceScore) + "\x1b[0m");
    print("  6. Morphological Inflection Rate    :   " + formatPct(morphResults.inflectionRate) + "        \x1b[32m" + formatPct(morphResults.inflectionRate) + "\x1b[0m");
    print("  7. Suffix Hijacking Guard (e.g. jani):  " + formatPct(morphResults.guardRate) + "       \x1b[32m" + formatPct(morphResults.guardRate) + "\x1b[0m");
    print("  8. Orthographic Precision (যুক্তবর্ণ)   :   " + formatPct(ambigResults.precisionRate) + "        \x1b[32m" + formatPct(ambigResults.score) + "\x1b[0m");
    print("  9. Fuzzy Typo Elasticity & Recovery :   " + formatPct(fuzzyResults.top1Rate) + " (Top-3: " + formatPct(fuzzyResults.top3Rate) + ") \x1b[32m" + formatPct(fuzzyResults.score) + "\x1b[0m");

    print("  " + "─".repeat(64));
    print("  \x1b[1mAvro Intelligence Score (AIS)       :\x1b[0m   " + gradeColor + ais.toFixed(1) + " / 100\x1b[0m");
    print("  \x1b[1mIntelligence Tier                   :\x1b[0m   " + gradeColor + gradeTier + "\x1b[0m");
    print("  \x1b[90mEvaluation Execution Time           :   " + totalDurationMs.toFixed(2) + " ms\x1b[0m");
    print("\x1b[1;35m" + "═".repeat(68) + "\x1b[0m\n");

    return ais;
}

runBenchmark();
