// =============================================================================
// Evaluator 3: Morphological Suffix & Boundary Integrity
// =============================================================================

function evaluateMorphology(engine, morphologyData) {
    var inflections = morphologyData.inflections || [];
    var boundaryGuards = morphologyData.boundaryGuards || [];

    var inflectionPassed = 0;
    var guardPassed = 0;

    // Helper: simulate sequential typing to populate cache naturally
    function typeSequential(text) {
        for (var c = 1; c <= text.length; c++) {
            engine.suggest(text.substring(0, c));
        }
        return engine.suggest(text);
    }

    // Part 1: Test inflectional suffix combinations
    for (var i = 0; i < inflections.length; i++) {
        var item = inflections[i];
        var res = typeSequential(item.input);
        var words = res.words || [];

        // Check if expected inflected word is in top suggestions (rank 0 or 1)
        var idx = words.indexOf(item.expected);
        if (idx === 0 || idx === 1) {
            inflectionPassed++;
        }
    }

    // Part 2: Test boundary guards against synthetic suffix hijacking
    for (var j = 0; j < boundaryGuards.length; j++) {
        var guard = boundaryGuards[j];
        
        // Simulate having typed the root word first
        typeSequential(guard.root);

        // Now type the full word sequentially
        var resGuard = typeSequential(guard.input);
        var wordsGuard = resGuard.words || [];
        var selectedWord = wordsGuard[resGuard.prevSelection || 0];

        // Must select the expected root/inflection and REJECT synthetic suffix
        if (selectedWord === guard.expected && selectedWord !== guard.rejectedSuffix) {
            guardPassed++;
        }
    }

    var inflectionRate = (inflectionPassed / inflections.length) * 100;
    var guardRate = (guardPassed / boundaryGuards.length) * 100;
    var overallScore = (inflectionRate * 0.5) + (guardRate * 0.5);

    return {
        score: overallScore,
        inflectionRate: inflectionRate,
        inflectionsTested: inflections.length,
        inflectionsPassed: inflectionPassed,
        guardRate: guardRate,
        guardsTested: boundaryGuards.length,
        guardsPassed: guardPassed
    };
}
