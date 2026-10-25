// =============================================================================
// Evaluator 4: Orthographic Ambiguity & Homophone Resolution
// =============================================================================

function evaluateAmbiguity(engine, ambiguityData) {
    var total = ambiguityData.length;
    var rank0Hits = 0;
    var top2Hits = 0;

    for (var i = 0; i < total; i++) {
        var item = ambiguityData[i];
        var res = engine.suggest(item.input);
        var words = res.words || [];

        var idx = words.indexOf(item.expected);
        if (idx === 0) {
            rank0Hits++;
            top2Hits++;
        } else if (idx === 1) {
            top2Hits++;
        }
    }

    var precisionRate = (rank0Hits / total) * 100;
    var top2Rate = (top2Hits / total) * 100;
    var score = (precisionRate * 0.7) + (top2Rate * 0.3);

    return {
        score: score,
        precisionRate: precisionRate,
        top2Rate: top2Rate,
        totalTested: total,
        rank0Hits: rank0Hits
    };
}
