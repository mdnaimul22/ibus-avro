// =============================================================================
// Evaluator 2: Adaptive Learning Velocity & Typo Noise Resilience
// =============================================================================

function evaluateAdaptive(engineConstructor) {
    // Sandbox clean engine instance
    var engine = new engineConstructor();
    engine._candidateSelections = {};
    engine._flushSave = function() {}; // sandbox in memory

    // Part 1: Learning Velocity (Convergence Speed)
    // Measure how many commits it takes for a non-default candidate to become #0.
    var testKey = "projukti";
    var defaultSuggestion = engine.suggest(testKey);
    var targetWord = "প্রযুক্তি";
    
    // Choose an alternate candidate if target is already 0
    var candidateWords = defaultSuggestion.words;
    var alternateCandidate = candidateWords.length > 1 ? candidateWords[1] : "প্রযুক্তির";

    var commitsNeeded = 0;
    var maxCommits = 10;
    for (var step = 1; step <= maxCommits; step++) {
        engine.stringCommitted(testKey, alternateCandidate);
        var currentTop = engine.suggest(testKey);
        var topWord = currentTop.words[currentTop.prevSelection || 0];
        if (topWord === alternateCandidate) {
            commitsNeeded = step;
            break;
        }
    }
    if (commitsNeeded === 0) commitsNeeded = maxCommits;

    // Part 2: Noise Resilience (Protection of Established Vocabulary)
    // An established word with frequent usage should NOT be overthrown by a single typo commit.
    var establishedKey = "ami";
    var establishedWord = "আমি";
    for (var i = 0; i < 5; i++) {
        engine.stringCommitted(establishedKey, establishedWord);
    }

    // Accidentally commit a typo candidate once
    var typoCandidate = "আমই";
    engine.stringCommitted(establishedKey, typoCandidate);

    // Verify if established word maintains top priority
    var topAfterTypo = engine.suggest(establishedKey);
    var topSelected = topAfterTypo.words[topAfterTypo.prevSelection || 0];
    var isNoiseResilient = (topSelected === establishedWord);

    // Velocity score: 1 commit = 100%, 2 = 95%, 3 = 85%, 4 = 70%, 5+ = 50%
    var velocityScore = 100;
    if (commitsNeeded === 2) velocityScore = 95;
    else if (commitsNeeded === 3) velocityScore = 85;
    else if (commitsNeeded === 4) velocityScore = 70;
    else if (commitsNeeded > 4) velocityScore = Math.max(30, 100 - (commitsNeeded * 12));

    var resilienceScore = isNoiseResilient ? 100 : 0;
    var combinedScore = (velocityScore * 0.6) + (resilienceScore * 0.4);

    return {
        score: combinedScore,
        convergenceCommits: commitsNeeded,
        velocityScore: velocityScore,
        noiseResilience: isNoiseResilient,
        resilienceScore: resilienceScore
    };
}
