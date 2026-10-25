// =============================================================================
// Evaluator 5: Fuzzy Typo Recovery & Keystroke Noise Tolerance
// =============================================================================

function evaluateFuzzy(engine, typoData) {
    var total = typoData.length;
    var recoveredTop1 = 0;
    var recoveredTop3 = 0;
    var details = [];

    for (var i = 0; i < total; i++) {
        var item = typoData[i];
        var res = engine.suggest(item.noisyInput);
        var words = res.words || [];

        var idx = words.indexOf(item.expected);
        if (idx === 0) {
            recoveredTop1++;
            recoveredTop3++;
        } else if (idx > 0 && idx < 3) {
            recoveredTop3++;
        }

        details.push({
            noisyInput: item.noisyInput,
            expected: item.expected,
            foundIndex: idx,
            errorType: item.errorType
        });
    }

    var top1Rate = (recoveredTop1 / total) * 100;
    var top3Rate = (recoveredTop3 / total) * 100;
    var score = (top1Rate * 0.5) + (top3Rate * 0.5);

    return {
        score: score,
        top1Rate: top1Rate,
        top3Rate: top3Rate,
        totalTested: total,
        recoveredTop1: recoveredTop1,
        recoveredTop3: recoveredTop3,
        details: details
    };
}
