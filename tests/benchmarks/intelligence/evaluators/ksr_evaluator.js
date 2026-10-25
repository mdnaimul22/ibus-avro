// =============================================================================
// Evaluator 1: Keystroke Savings Rate (KSR) & Top-1 / Top-3 Hit Rate
// =============================================================================

function evaluateKSR(engine, corpusData) {
    var totalWords = corpusData.length;
    var top1Hits = 0;
    var top3Hits = 0;
    var totalBaselineKeystrokes = 0;
    var totalActualKeystrokes = 0;
    var earlyPredictions = 0;

    for (var i = 0; i < totalWords; i++) {
        var item = corpusData[i];
        var input = item.input;
        var expected = item.expected;
        
        // Baseline: typing entire phonetic input + Space without auto-prediction
        var baseline = input.length + 1;
        totalBaselineKeystrokes += baseline;

        // Evaluate full input suggestions
        var fullRes = engine.suggest(input);
        var fullWords = fullRes.words || [];
        var fullIdx = fullWords.indexOf(expected);

        if (fullIdx === 0) {
            top1Hits++;
            top3Hits++;
        } else if (fullIdx > 0 && fullIdx < 3) {
            top3Hits++;
        }

        // Simulate character-by-character typing to detect early prediction
        var actualKeystrokes = baseline;
        if (fullIdx > 0) {
            actualKeystrokes = input.length + fullIdx + 1; // arrows + space
        } else if (fullIdx < 0) {
            actualKeystrokes = input.length + 4; // penalty for unlisted word
        }

        for (var c = 1; c < input.length; c++) {
            var prefix = input.substring(0, c);
            var res = engine.suggest(prefix);
            var words = res.words || [];

            if (words.length > 0 && words[res.prevSelection || 0] === expected) {
                actualKeystrokes = c + 1; // committed early via Space
                earlyPredictions++;
                break;
            }
        }

        totalActualKeystrokes += actualKeystrokes;
    }

    var top1Rate = (top1Hits / totalWords) * 100;
    var top3Rate = (top3Hits / totalWords) * 100;
    var ksr = ((totalBaselineKeystrokes - totalActualKeystrokes) / totalBaselineKeystrokes) * 100;
    if (ksr < 0) ksr = 0;

    return {
        top1HitRate: top1Rate,
        top3HitRate: top3Rate,
        ksr: ksr,
        totalWords: totalWords,
        earlyPredictions: earlyPredictions,
        totalBaselineKeystrokes: totalBaselineKeystrokes,
        totalActualKeystrokes: totalActualKeystrokes
    };
}
