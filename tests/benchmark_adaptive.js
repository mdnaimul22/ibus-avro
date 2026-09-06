/**
 * Speed comparison: Old sort (dist only) vs New sort (dist + freq boost)
 * Runs 100,000 sort operations and compares elapsed time.
 */

// Levenshtein
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({length: m+1}, (_, i) => [i]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i-1] === b[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
}

// ── OLD: sort by distance only ───────────────────────────────────────────────
function sortOld(phonetic, candidates) {
    const list = candidates.map(item => ({
        item, dist: levenshtein(phonetic, item)
    }));
    list.sort((a, b) => a.dist - b.dist);
    return list.map(x => x.item);
}

// ── NEW: sort with frequency boost ───────────────────────────────────────────
function sortNew(phonetic, candidates, freqMap) {
    const list = candidates.map(item => {
        const freq  = freqMap[item] || 0;
        const score = levenshtein(phonetic, item) - (freq > 0 ? (10 + freq) : 0);
        return { item, score };
    });
    list.sort((a, b) => a.score - b.score);
    return list.map(x => x.item);
}

// ── Test data ────────────────────────────────────────────────────────────────
const RUNS = 100_000;

const testCases = [
    { phonetic: 'ami',    candidates: ['আমি', 'আমা', 'আমার', 'আমাদের', 'আম'] },
    { phonetic: 'tumi',   candidates: ['তুমি', 'তোমার', 'তোমাদের', 'তোমাকে', 'তুমিও'] },
    { phonetic: 'bangla', candidates: ['বাংলা', 'বাংলাদেশ', 'বাংলাদেশের', 'বাংলায়', 'বাংলাতে'] },
    { phonetic: 'k',      candidates: ['ক', 'কি', 'কী', 'কে', 'কা', 'কো', 'কু', 'কান', 'কার', 'কাল'] },
];

// Simulate a realistic freqMap (a few words have been selected before)
const freqMap = { 'আমি': 5, 'বাংলা': 3, 'কি': 7, 'তুমি': 2 };

console.log('\n══════════════════════════════════════════════════════════');
console.log('  Speed Benchmark: Old Sort vs New (Freq-Boosted) Sort');
console.log(`  ${RUNS.toLocaleString()} runs per method`);
console.log('══════════════════════════════════════════════════════════\n');

// ── Run OLD ──────────────────────────────────────────────────────────────────
const t0 = Date.now();
for (let i = 0; i < RUNS; i++) {
    const tc = testCases[i % testCases.length];
    sortOld(tc.phonetic, tc.candidates);
}
const oldMs = Date.now() - t0;

// ── Run NEW ──────────────────────────────────────────────────────────────────
const t1 = Date.now();
for (let i = 0; i < RUNS; i++) {
    const tc = testCases[i % testCases.length];
    sortNew(tc.phonetic, tc.candidates, freqMap);
}
const newMs = Date.now() - t1;

// ── Results ──────────────────────────────────────────────────────────────────
const diff    = newMs - oldMs;
const pct     = ((diff / oldMs) * 100).toFixed(2);
const perOld  = (oldMs / RUNS).toFixed(4);
const perNew  = (newMs / RUNS).toFixed(4);

console.log(`  পুরনো সর্ট (dist only):      ${oldMs} ms  (${perOld} ms/sort)`);
console.log(`  নতুন সর্ট (freq boost):      ${newMs} ms  (${perNew} ms/sort)`);
console.log();
if (Math.abs(diff) <= 5) {
    console.log(`  ✅  পার্থক্য: ${diff >= 0 ? '+' : ''}${diff} ms — পরিমাপযোগ্য পার্থক্য নেই (নয়েজ রেঞ্জে)`);
} else if (diff > 0) {
    console.log(`  ⚠️  নতুন সর্ট ${diff} ms (${pct}%) ধীর`);
} else {
    console.log(`  ✅  নতুন সর্ট ${Math.abs(diff)} ms (${Math.abs(pct)}%) দ্রুত`);
}

// ── Correctness check ────────────────────────────────────────────────────────
console.log('\n  --- শুদ্ধতা যাচাই (freq-boosted শব্দ প্রথমে আসছে কি?) ---');
const sample = { phonetic: 'ami', candidates: ['আমা', 'আমার', 'আমি', 'আম'] };
const freqSample = { 'আমি': 5 };
const resultNew = sortNew(sample.phonetic, sample.candidates, freqSample);
const resultOld = sortOld(sample.phonetic, sample.candidates);
console.log(`  পুরনো সর্ট: ${resultOld.join(' | ')}`);
console.log(`  নতুন সর্ট:  ${resultNew.join(' | ')}  ← "আমি" (freq=5) প্রথমে`);
console.log(`  ✅  "আমি" নতুন সর্টে প্রথমে: ${resultNew[0] === 'আমি'}`);

console.log('\n══════════════════════════════════════════════════════════\n');
