# IBus Avro Test & Benchmark Suite

This directory contains performance benchmarks and automated verification test suites for the `ibus-avro` engine.

## Test & Benchmark Scripts

| Script | Runtime | Description |
| :--- | :--- | :--- |
| [`benchmark.js`](./benchmark.js) | GJS | Measures end-to-end suggestion generation performance (30,000 suggestions across 30 diverse phonetic words). |
| [`benchmark_adaptive.js`](./benchmark_adaptive.js) | Node.js | Compares old Levenshtein-only sorting vs new frequency-boosted adaptive sorting (100,000 runs). |
| [`benchmark_uncached.js`](./benchmark_uncached.js) | GJS | Cold-start / worst-case suggestion performance benchmark without in-memory caching. |
| [`benchmark_parser.js`](./benchmark_parser.js) | GJS | Benchmarks raw Avro phonetic parser speed (`avrolib.js`) for 300,000 parses. |
| [`benchmark_regex.js`](./benchmark_regex.js) | GJS | Benchmarks regular expression engine matching (`avroregexlib.js`) for 300,000 parses. |
| [`test_adaptive.js`](./test_adaptive.js) | Node.js | Comprehensive automated unit and integration tests verifying adaptive learning, selection tracking, pruning, persistence, and legacy migration. |
| [`verify_suggestion_builder.js`](./verify_suggestion_builder.js) | GJS | Tests 2-second debounced asynchronous file saving and UTF-8 JSON persistence. |

## Running the Tests

You can run individual tests from the project root or from inside the `tests/` folder:

```bash
# 1. Full Suggestion Engine Benchmark
gjs tests/benchmark.js

# 2. Cold Uncached Benchmark
gjs tests/benchmark_uncached.js

# 3. Phonetic Parser Benchmark
gjs tests/benchmark_parser.js

# 4. Regex Parser Benchmark
gjs tests/benchmark_regex.js

# 5. Adaptive Sorting Benchmark
node tests/benchmark_adaptive.js

# 6. Adaptive Suggestion Automated Integration Test Suite
node tests/test_adaptive.js

# 7. Asynchronous Saving Verification
gjs tests/verify_suggestion_builder.js
```
