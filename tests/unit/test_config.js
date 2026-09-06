#!/usr/bin/env gjs
// =============================================================================
// Unit Tests: src/config Layer
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

const Config = imports.config.index;

describe("Config Layer - Settings & Paths", function() {

    it("Settings constants are properly defined as single source of truth", function() {
        var S = Config.Settings;
        assert(S !== undefined, "Settings object should be exported");
        assertEqual(S.PRUNE_KEY_LIMIT, 2000, "PRUNE_KEY_LIMIT should be 2000");
        assertEqual(S.PRUNE_KEEP_LIMIT, 1500, "PRUNE_KEEP_LIMIT should be 1500");
        assertEqual(S.SAVE_DEBOUNCE_MS, 2000, "SAVE_DEBOUNCE_MS should be 2000 ms");
        assertEqual(S.CANDIDATE_FILE_NAME, "/.candidate-selections.json", "CANDIDATE_FILE_NAME matches standard");
        assertEqual(S.JSON_INDENT, 2, "JSON_INDENT should be 2 spaces");
        assertEqual(S.SCHEMA_ID, "com.omicronlab.avro", "SCHEMA_ID matches GSettings schema");
    });

    it("Paths provides valid pkgdatadir and libexecdir", function() {
        var P = Config.Paths;
        assert(P !== undefined, "Paths object should be exported");
        assert(typeof P.get_pkgdatadir === "function", "get_pkgdatadir is a function");
        assert(typeof P.get_libexecdir === "function", "get_libexecdir is a function");
        assert(P.get_pkgdatadir().length > 0, "pkgdatadir is non-empty");
        assert(P.get_libexecdir().length > 0, "libexecdir is non-empty");
    });

});

if (!Assert.summarize()) {
    imports.system.exit(1);
}
