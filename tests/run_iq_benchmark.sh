#!/usr/bin/env bash
# =============================================================================
# Avro Cognitive & Intelligence Benchmark (AIS) Runner
# =============================================================================
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

gjs tests/benchmarks/intelligence/test_intelligence_quotient.js
