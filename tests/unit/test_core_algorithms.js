#!/usr/bin/env gjs
// =============================================================================
// Unit Tests: src/core/algorithms (Levenshtein Distance)
// =============================================================================

imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');
imports.searchPath.unshift('./tests');
imports.searchPath.unshift('../tests');

const Assert = imports.helpers.assert;
const describe = Assert.describe;
const it = Assert.it;
const assertEqual = Assert.assertEqual;

const Core = imports.core.index;
const levenshtein = Core.Levenshtein;

describe("Core Layer - Levenshtein Distance Algorithm", function() {

    it("Identical strings have distance 0", function() {
        assertEqual(levenshtein("", ""), 0);
        assertEqual(levenshtein("avro", "avro"), 0);
        assertEqual(levenshtein("বাংলা", "বাংলা"), 0);
    });

    it("Empty string distances match string length", function() {
        assertEqual(levenshtein("", "test"), 4);
        assertEqual(levenshtein("bangla", ""), 6);
    });

    it("Single edit operations calculate accurately", function() {
        assertEqual(levenshtein("cat", "bat"), 1, "Substitution");
        assertEqual(levenshtein("cat", "cats"), 1, "Insertion");
        assertEqual(levenshtein("cats", "cat"), 1, "Deletion");
    });

    it("Symmetry holds: lev(a, b) === lev(b, a)", function() {
        var str1 = "অভ্র";
        var str2 = "অমর";
        assertEqual(levenshtein(str1, str2), levenshtein(str2, str1));
    });

    it("Bengali phonetic word distance calculation", function() {
        assertEqual(levenshtein("আমি", "তুমি"), 2);
        assertEqual(levenshtein("বাংলাদেশ", "বাংলা"), 3);
    });

});

if (!Assert.summarize()) {
    imports.system.exit(1);
}
