#!/usr/bin/env gjs
// =============================================================================
// Performance Benchmark: Suggestion Engine (Cached & Uncached)
// =============================================================================

imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');

const Services = imports.services.index;
const GLib = imports.gi.GLib;

var builder = new Services.SuggestionEngine();

var testWords = [
    "ami", "bangla", "gan", "gai", "tumi", "ki", "korcho", "amader", "desh", "shadhin",
    "priyo", "valobashi", "abbu", "ammu", "bhai", "bon", "khabar", "khabo", "kothay", "jabo",
    "shundor", "dhaka", "bangladesh", "jonno", "kotha", "bolte", "chi", "parbo", "na", "keno"
];

print("====================================================");
print("  IBus Avro Suggestion Engine Performance Benchmark");
print("====================================================");
print("Test dataset: " + testWords.length + " diverse phonetic words");

// 1. Warm-up
for (var i = 0; i < 50; i++) {
    for (var j = 0; j < testWords.length; j++) {
        builder.suggest(testWords[j]);
    }
}

// 2. Cached (Warm) Run: 1,000 iterations = 30,000 suggestions
var iterationsCached = 1000;
var totalCachedOps = iterationsCached * testWords.length;
var tStartCached = GLib.get_monotonic_time();

for (var i = 0; i < iterationsCached; i++) {
    for (var j = 0; j < testWords.length; j++) {
        builder.suggest(testWords[j]);
    }
}

var tEndCached = GLib.get_monotonic_time();
var durationMsCached = (tEndCached - tStartCached) / 1000.0;
var avgPerWordCached = durationMsCached / totalCachedOps;
var throughputCached = (totalCachedOps / (durationMsCached / 1000.0)).toFixed(0);

print("\n[1] Cached Suggestion Throughput:");
print("    Operations:  " + totalCachedOps.toLocaleString() + " words");
print("    Duration:    " + durationMsCached.toFixed(2) + " ms");
print("    Latency:     " + avgPerWordCached.toFixed(4) + " ms / word");
print("    Throughput:  " + Number(throughputCached).toLocaleString() + " words / sec");

// 3. Uncached (Cold / Worst-case) Run: 100 iterations = 3,000 suggestions
var iterationsUncached = 100;
var totalUncachedOps = iterationsUncached * testWords.length;
var tStartUncached = GLib.get_monotonic_time();

for (var i = 0; i < iterationsUncached; i++) {
    for (var j = 0; j < testWords.length; j++) {
        builder._phoneticCache = {}; // force cold trie database search
        builder.suggest(testWords[j]);
    }
}

var tEndUncached = GLib.get_monotonic_time();
var durationMsUncached = (tEndUncached - tStartUncached) / 1000.0;
var avgPerWordUncached = durationMsUncached / totalUncachedOps;
var throughputUncached = (totalUncachedOps / (durationMsUncached / 1000.0)).toFixed(0);

print("\n[2] Uncached (Cold) Trie Search Throughput:");
print("    Operations:  " + totalUncachedOps.toLocaleString() + " words");
print("    Duration:    " + durationMsUncached.toFixed(2) + " ms");
print("    Latency:     " + avgPerWordUncached.toFixed(4) + " ms / word");
print("    Throughput:  " + Number(throughputUncached).toLocaleString() + " words / sec");
print("====================================================\n");
