const phonetic = imports.core.parser.phonetic;
const regex = imports.core.parser.regex;
const levenshtein = imports.core.algorithms.levenshtein;
const autocorrect = imports.core.autocorrect.autocorrect;

var AvroPhonetic = phonetic.OmicronLab.Avro.Phonetic;
var AvroRegex = regex.AvroRegex;
var Levenshtein = levenshtein.levenshtein;
var AutocorrectDB = autocorrect.db;

var Core = {
    AvroPhonetic: AvroPhonetic,
    AvroRegex: AvroRegex,
    Levenshtein: Levenshtein,
    AutocorrectDB: AutocorrectDB
};
