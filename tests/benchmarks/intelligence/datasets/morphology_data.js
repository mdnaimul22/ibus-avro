// =============================================================================
// Benchmark Dataset: Bengali Morphology & Inflectional Suffix Combinations
// =============================================================================

var MorphologyData = {
    // Inflected nouns and pronouns with case markers & plural suffixes
    inflections: [
        { input: "manushder", expected: "মানুষদের", desc: "Plural genitive -দের" },
        { input: "deshe", expected: "দেশে", desc: "Locative inflection -এ" },
        { input: "bhashar", expected: "ভাষার", desc: "Genitive inflection -র" },
        { input: "boigulo", expected: "বইগুলো", desc: "Definite plural -গুলো" },
        { input: "bondhura", expected: "বন্ধুরা", desc: "Nominative plural -রা" },
        { input: "kothagulo", expected: "কথাগুলো", desc: "Inanimate plural -গুলো" },
        { input: "amader", expected: "আমাদের", desc: "Pronominal genitive -দের" },
        { input: "banglatai", expected: "বাংলাটাই", desc: "Emphatic definite -টাই" },
        { input: "ghortite", expected: "ঘরটিতে", desc: "Classifier + locative -টিতে" },
        { input: "deshke", expected: "দেশকে", desc: "Accusative inflection -কে" },
        { input: "shohore", expected: "শহরে", desc: "Locative -এ" },
        { input: "kajei", expected: "কাজেই", desc: "Emphatic -ই" }
    ],

    // Critical root vs synthetic suffix minimal pairs (must not hijack root verb)
    boundaryGuards: [
        { input: "jani", root: "jan", expected: "জানি", rejectedSuffix: "জানই" },
        { input: "dekhi", root: "dekh", expected: "দেখি", rejectedSuffix: "দেখই" },
        { input: "shuni", root: "shun", expected: "শুনি", rejectedSuffix: "শুনই" },
        { input: "bujhi", root: "bujh", expected: "বুঝি", rejectedSuffix: "বুঝই" },
        { input: "choli", root: "chol", expected: "চলি", rejectedSuffix: "চলই" }
    ]
};
