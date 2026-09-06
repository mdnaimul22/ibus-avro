#!/usr/bin/env gjs
// =============================================================================
// Unit Tests: src/data Layer (Dictionary & Trie Search)
// =============================================================================

imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');
imports.searchPath.unshift('./tests');
imports.searchPath.unshift('../tests');

const Assert = imports.helpers.assert;
const describe = Assert.describe;
const it = Assert.it;
const assert = Assert.assert;

const Data = imports.data.index;

describe("Data Layer - Dictionary & Search", function() {

    it("DBSearch instantiates and returns dictionary suggestions", function() {
        var dbSearch = new Data.DBSearch();
        var results = dbSearch.search("ami");
        assert(results instanceof Array, "Search results should be an Array");
        assert(results.length > 0, "Results for 'ami' should not be empty");
        assert(results.indexOf("আমি") !== -1, "Results for 'ami' should include 'আমি'");
    });

    it("DBSearch accurately resolves complex words with conjuncts", function() {
        var dbSearch = new Data.DBSearch();
        var results = dbSearch.search("shadhin");
        assert(results.indexOf("স্বাধীন") !== -1, "Results for 'shadhin' should include 'স্বাধীন'");

        var banglaResults = dbSearch.search("bangla");
        assert(banglaResults.indexOf("বাংলা") !== -1, "Results for 'bangla' should include 'বাংলা'");
    });

    it("Suffix dictionary DB is loaded and contains suffix entries", function() {
        var suffixDb = Data.SuffixDictDB;
        assert(suffixDb !== undefined, "SuffixDictDB should be defined");
        assert(typeof suffixDb === "object", "SuffixDictDB is a dictionary object");
        assert(Object.keys(suffixDb).length > 5, "SuffixDictDB contains rules");
    });

});

if (!Assert.summarize()) {
    imports.system.exit(1);
}
