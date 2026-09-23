#!/usr/bin/env gjs
// =============================================================================
// Unit Tests: src/core/parser & autocorrect
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

const Core = imports.core.index;

describe("Core Layer - Phonetic & Regex Parsers", function() {

    it("Phonetic parser accurately parses common phonetic words", function() {
        var parser = Core.AvroPhonetic;
        assertEqual(parser.parse("ami"), "আমি");
        assertEqual(parser.parse("bangla"), "বাংলা");
        assertEqual(parser.parse("tumi"), "তুমি");
        assertEqual(parser.parse("amar"), "আমার");
        assertEqual(parser.parse("desh"), "দেশ");
    });

    it("Regex parser generates Unicode search patterns for dictionary lookup", function() {
        var regexParser = new Core.AvroRegex();
        var result = regexParser.parse("ami");
        assert(result !== undefined && result.length > 0, "Regex parser output should not be empty");
        // Regex pattern contains Bengali Unicode ranges for 'a', 'm', 'i'
        assert(result.indexOf("\\u09ae") !== -1, "Regex contains Bengali character 'm' range");
    });

    it("Autocorrect database is loaded and contains entries", function() {
        var db = Core.AutocorrectDB;
        assert(db !== undefined, "AutocorrectDB should be exported");
        assert(typeof db === "object", "AutocorrectDB is a dictionary object");
        assert(Object.keys(db).length > 10, "AutocorrectDB contains entries");
    });

});

if (!Assert.summarize()) {
    imports.system.exit(1);
}
