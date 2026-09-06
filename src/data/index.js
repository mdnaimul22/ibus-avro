const avrodict = imports.data.avrodict;
const suffixdict = imports.data.suffixdict;
const search = imports.data.search;

var AvroDict = avrodict;
var SuffixDictDB = suffixdict.db;
var DBSearch = search.DBSearch;

var Data = {
    AvroDict: AvroDict,
    SuffixDictDB: SuffixDictDB,
    DBSearch: DBSearch
};
