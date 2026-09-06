#!/usr/bin/env gjs
// =============================================================================
// IBus Avro Regex Parser Performance Test
// =============================================================================
imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');
const Core = imports.core.index;
const GLib = imports.gi.GLib;

var parser = new Core.AvroRegex();

var testWords = [
    "ami", "bangla", "gan", "gai", "tumi", "ki", "korcho", "amader", "desh", "shadhin",
    "priyo", "valobashi", "abbu", "ammu", "bhai", "bon", "khabar", "khabo", "kothay", "jabo",
    "shundor", "dhaka", "bangladesh", "jonno", "kotha", "bolte", "chi", "parbo", "na", "keno"
];

print("====================================================");
print("Starting benchmark of Avro Regex Parser...");
print("Test words count: " + testWords.length);
print("Iterations: 10000");
print("====================================================");

var startTime = GLib.get_monotonic_time();

var iterations = 10000;
for (var i = 0; i < iterations; i++) {
    for (var j = 0; j < testWords.length; j++) {
        parser.parse(testWords[j]);
    }
}

var endTime = GLib.get_monotonic_time();
var durationMs = (endTime - startTime) / 1000.0;

print("Processed " + (iterations * testWords.length) + " parses.");
print("Total duration: " + durationMs.toFixed(2) + " ms");
print("Average time per parse: " + (durationMs / (iterations * testWords.length)).toFixed(4) + " ms");
print("====================================================");
