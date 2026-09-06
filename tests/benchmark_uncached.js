#!/usr/bin/env gjs
// =============================================================================
// IBus Avro Uncached Suggestion Performance Test
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
print("Starting UNCACHED benchmark of Avro Phonetic Suggestion Engine...");
print("Test words count: " + testWords.length);
print("Iterations: 100 (Total suggestions processed: " + (testWords.length * 10) + ")");
print("====================================================");

// Clear cache before starting
builder._phoneticCache = {};

var startTime = GLib.get_monotonic_time();

var iterations = 100;
for (var i = 0; i < iterations; i++) {
    for (var j = 0; j < testWords.length; j++) {
        // Clear the cache to force dbSearch.search to run
        builder._phoneticCache = {};
        builder.suggest(testWords[j]);
    }
}

var endTime = GLib.get_monotonic_time();
var durationMs = (endTime - startTime) / 1000.0;

print("Processed " + (iterations * testWords.length) + " suggestions.");
print("Total duration: " + durationMs.toFixed(2) + " ms");
print("Average time per suggestion: " + (durationMs / (iterations * testWords.length)).toFixed(4) + " ms");
print("====================================================");
