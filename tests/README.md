# IBus Avro Automated Test & Benchmark Suite

This directory contains the automated test suite and performance benchmarks for the `ibus-avro` engine, organized in a modular structure that directly mirrors `src/`.

---

## Architecture Overview

```text
tests/
├── run_tests.sh                 # Unified test runner (executes all test suites)
│
├── unit/                        # Unit tests directly testing src/ modules
│   ├── test_config.js           # src/config (Settings constants, limits, Paths)
│   ├── test_core_algorithms.js  # src/core/algorithms (Levenshtein distance)
│   ├── test_core_parser.js      # src/core/parser (Phonetic & Regex parsers)
│   ├── test_data_search.js      # src/data (Trie search & dictionary lookups)
│   └── test_services_suggestion.js # src/services (Suggestion scoring & adaptive history)
│
├── integration/                 # End-to-end and file persistence tests
│   └── test_persistence.js     # Sandboxed JSON file persistence & debounced I/O
│
├── benchmarks/                  # Performance benchmarks (throughput & latency)
│   ├── bench_engine.js          # Cached & uncached suggestion engine performance
│   └── bench_parser.js          # Raw phonetic and regex parser speed
│
└── helpers/
    └── assert.js                # Standard test harness (describe, it, assertEqual)
```

---

## Running Tests

### 1. Run All Tests (Single Command)
To run the entire test suite with a consolidated pass/fail report:

```bash
./tests/run_tests.sh
```

### 2. Run Individual Unit Tests
Individual test suites can be executed directly via `gjs`:

```bash
# Config Layer
gjs tests/unit/test_config.js

# Core Algorithms (Levenshtein)
gjs tests/unit/test_core_algorithms.js

# Core Parsers (Phonetic & Regex)
gjs tests/unit/test_core_parser.js

# Data Layer (Trie Search & Suffixes)
gjs tests/unit/test_data_search.js

# Services Layer (Suggestion Engine)
gjs tests/unit/test_services_suggestion.js

# Sandboxed Persistence Integration
gjs tests/integration/test_persistence.js
```

### 3. Run Performance Benchmarks
To measure system throughput and latency:

```bash
# Suggestion Engine Throughput (Cached & Uncached)
gjs tests/benchmarks/bench_engine.js

# Core Parser Throughput (Phonetic & Regex)
gjs tests/benchmarks/bench_parser.js
```
