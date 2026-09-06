#!/usr/bin/env gjs
// =============================================================================
// Unit Tests: src/services (Suggestion Engine & Adaptive Learning)
// =============================================================================

imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');
imports.searchPath.unshift('./tests');
imports.searchPath.unshift('../tests');

const Assert = imports.helpers.assert;
const describe = Assert.describe;
const it = Assert.it;
const assert = Assert.assert;
const assertEqual = Assert.assertEqual;

const Services = imports.services.index;
const Config = imports.config.index;

describe("Services Layer - Suggestion Engine & Adaptive Scoring", function() {

    it("SuggestionBuilder generates valid word suggestions", function() {
        var sb = new Services.SuggestionEngine();
        sb._candidateSelections = {};
        sb._flushSave = function() {}; // sandbox in memory

        var res = sb.suggest("ami");
        assert(res !== undefined, "Result should be defined");
        assert(res.words instanceof Array, "Suggestions words must be an Array");
        assert(res.words.length > 0, "Suggestions should not be empty");
        assertEqual(res.words[0], "আমি", "Top suggestion for 'ami' should be 'আমি'");
    });

    it("Committing a word increments selection frequency", function() {
        var sb = new Services.SuggestionEngine();
        sb._candidateSelections = {};
        sb._flushSave = function() {};

        sb.stringCommitted("ami", "আমি");
        sb.stringCommitted("ami", "আমি");
        sb.stringCommitted("ami", "আমি");

        var freq = sb._candidateSelections["ami"]["আমি"].freq;
        assertEqual(freq, 3, "Frequency should increment to 3 after 3 commits");
    });

    it("Navigation preview does NOT increment frequency", function() {
        var sb = new Services.SuggestionEngine();
        sb._candidateSelections = {};
        sb._flushSave = function() {};

        sb._recordSelection("tumi", "তুমি", false);
        sb._recordSelection("tumi", "তুমি", false);

        var freq = sb._candidateSelections["tumi"]["তুমি"].freq;
        assertEqual(freq, 0, "Preview navigation should keep freq at 0");
    });

    it("High frequency candidate is prioritized and sorted to top", function() {
        var sb = new Services.SuggestionEngine();
        sb._candidateSelections = {};
        sb._flushSave = function() {};

        // In pure phonetic 'k', 'ক' usually comes before 'কি'.
        // Commit 'কি' 5 times to simulate frequent usage.
        for (var i = 0; i < 5; i++) {
            sb.stringCommitted("k", "কি");
        }

        var candidates = ["ক", "কি", "কী", "কে", "কা"];
        var sorted = sb._sortByPhoneticRelevance("k", candidates, "k");

        assertEqual(sorted[0], "কি", "High frequency word 'কি' must sort to index 0");
        assert(sorted.indexOf("কি") < sorted.indexOf("ক"), "'কি' should rank above 'ক'");
    });

    it("Pruning limits total stored keys to PRUNE_KEEP_LIMIT", function() {
        var sb = new Services.SuggestionEngine();
        sb._candidateSelections = {};
        sb._flushSave = function() {};

        // Populate with keys exceeding PRUNE_KEY_LIMIT
        var limit = Config.Settings.PRUNE_KEY_LIMIT;
        var keepLimit = Config.Settings.PRUNE_KEEP_LIMIT;

        for (var i = 0; i <= limit + 50; i++) {
            var k = "key_" + i;
            sb._candidateSelections[k] = { "word": { freq: 1, lastSelected: i } };
        }

        assertEqual(Object.keys(sb._candidateSelections).length, limit + 51);

        sb._pruneCandidateSelections();

        var remainingKeys = Object.keys(sb._candidateSelections).length;
        assertEqual(remainingKeys, keepLimit, "Keys count after prune must equal PRUNE_KEEP_LIMIT (" + keepLimit + ")");
    });

});

if (!Assert.summarize()) {
    imports.system.exit(1);
}
