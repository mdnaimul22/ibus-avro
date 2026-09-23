#!/usr/bin/env gjs
// =============================================================================
// Performance Benchmark: Phonetic & Regex Parsers
// =============================================================================

imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');

const Core = imports.core.index;
const GLib = imports.gi.GLib;

var phoneticParser = Core.AvroPhonetic;
var regexParser = new Core.AvroRegex();

var testWords = [
    "ami", "bangla", "gan", "gai", "tumi", "ki", "korcho", "amader", "desh", "shadhin",
    "priyo", "valobashi", "abbu", "ammu", "bhai", "bon", "khabar", "khabo", "kothay", "jabo",
    "shundor", "dhaka", "bangladesh", "jonno", "kotha", "bolte", "chi", "parbo", "na", "keno"
];

print("====================================================");
print("  IBus Avro Core Parsers Performance Benchmark");
print("====================================================");

var iterations = 5000;
var totalOps = iterations * testWords.length; // 150,000 parses

// 1. Phonetic Parser Benchmark
var tStartPhonetic = GLib.get_monotonic_time();
for (var i = 0; i < iterations; i++) {
    for (var j = 0; j < testWords.length; j++) {
        phoneticParser.parse(testWords[j]);
    }
}
var tEndPhonetic = GLib.get_monotonic_time();
var durationPhonetic = (tEndPhonetic - tStartPhonetic) / 1000.0;
var avgPhonetic = durationPhonetic / totalOps;
var throughputPhonetic = (totalOps / (durationPhonetic / 1000.0)).toFixed(0);

print("\n[1] Phonetic Parser Throughput:");
print("    Operations:  " + totalOps.toLocaleString() + " parses");
print("    Duration:    " + durationPhonetic.toFixed(2) + " ms");
print("    Latency:     " + avgPhonetic.toFixed(4) + " ms / parse");
print("    Throughput:  " + Number(throughputPhonetic).toLocaleString() + " parses / sec");

// 2. Regex Parser Benchmark
var tStartRegex = GLib.get_monotonic_time();
for (var i = 0; i < iterations; i++) {
    for (var j = 0; j < testWords.length; j++) {
        regexParser.parse(testWords[j]);
    }
}
var tEndRegex = GLib.get_monotonic_time();
var durationRegex = (tEndRegex - tStartRegex) / 1000.0;
var avgRegex = durationRegex / totalOps;
var throughputRegex = (totalOps / (durationRegex / 1000.0)).toFixed(0);

print("\n[2] Regex Pattern Compiler Throughput:");
print("    Operations:  " + totalOps.toLocaleString() + " parses");
print("    Duration:    " + durationRegex.toFixed(2) + " ms");
print("    Latency:     " + avgRegex.toFixed(4) + " ms / parse");
print("    Throughput:  " + Number(throughputRegex).toLocaleString() + " parses / sec");
print("====================================================\n");
