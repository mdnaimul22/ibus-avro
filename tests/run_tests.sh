#!/usr/bin/env bash
# =============================================================================
# IBus Avro Automated Test Suite Runner
# =============================================================================
set -e

# Terminal Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo -e "${BLUE}${BOLD}======================================================${NC}"
echo -e "${BLUE}${BOLD}        IBus Avro Automated Test Suite Runner         ${NC}"
echo -e "${BLUE}${BOLD}======================================================${NC}"

FAILED=0
SUITES_RUN=0

run_suite() {
    local suite_path="$1"
    local suite_name="$2"
    SUITES_RUN=$((SUITES_RUN + 1))

    echo -e "\n${YELLOW}[*] Running: ${suite_name} (${suite_path})...${NC}"
    if gjs "$suite_path"; then
        echo -e "${GREEN}[+] Suite Passed: ${suite_name}${NC}"
    else
        echo -e "${RED}[-] Suite FAILED: ${suite_name}${NC}"
        FAILED=$((FAILED + 1))
    fi
}

# 1. Unit Tests (src/ mirror)
run_suite "tests/unit/test_config.js" "Config Layer (Settings & Paths)"
run_suite "tests/unit/test_core_algorithms.js" "Core Algorithms (Levenshtein Distance)"
run_suite "tests/unit/test_core_parser.js" "Core Parsers (Phonetic & Regex)"
run_suite "tests/unit/test_data_search.js" "Data Layer (Trie Search & Dict)"
run_suite "tests/unit/test_services_suggestion.js" "Services Layer (Suggestion Engine & Ranking)"

# 2. Integration Tests
run_suite "tests/integration/test_persistence.js" "Integration (Sandboxed Debounce & Persistence)"

echo -e "\n${BLUE}${BOLD}======================================================${NC}"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}${BOLD}  ALL TEST SUITES PASSED! (${SUITES_RUN}/${SUITES_RUN} successful)${NC}"
    echo -e "${BLUE}${BOLD}======================================================${NC}"
    exit 0
else
    echo -e "${RED}${BOLD}  ${FAILED} TEST SUITE(S) FAILED! (${SUITES_RUN} total executed)${NC}"
    echo -e "${BLUE}${BOLD}======================================================${NC}"
    exit 1
fi
