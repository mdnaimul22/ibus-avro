// =============================================================================
// IBus Avro Test Harness & Assertion Library
// Supports both GJS and Node.js environments
// =============================================================================

var totalTests = 0;
var passedTests = 0;
var failedTests = 0;
var currentSuite = "";

function describe(suiteName, fn) {
    currentSuite = suiteName;
    print("\n══════════════════════════════════════════════════════════");
    print("  " + suiteName);
    print("══════════════════════════════════════════════════════════");
    try {
        fn();
    } catch (e) {
        print("  ❌  SUITE ERROR: " + (e.stack || e));
        failedTests++;
    }
}

function it(testName, fn) {
    totalTests++;
    try {
        fn();
        passedTests++;
        print("  ✅  PASS: " + testName);
    } catch (e) {
        failedTests++;
        print("  ❌  FAIL: " + testName);
        print("       " + (e.message || e));
        if (e.stack) {
            print("       " + e.stack.split("\n").slice(0, 3).join("\n       "));
        }
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error((message ? message + " - " : "") + "Expected: " + JSON.stringify(expected) + ", got: " + JSON.stringify(actual));
    }
}

function assertDeepEqual(actual, expected, message) {
    var actStr = JSON.stringify(actual);
    var expStr = JSON.stringify(expected);
    if (actStr !== expStr) {
        throw new Error((message ? message + " - " : "") + "Expected: " + expStr + ", got: " + actStr);
    }
}

function assertGreaterThan(actual, expected, message) {
    if (actual <= expected) {
        throw new Error((message ? message + " - " : "") + "Expected " + actual + " to be greater than " + expected);
    }
}

function summarize() {
    print("\n----------------------------------------------------------");
    print("  Summary: " + passedTests + " passed, " + failedTests + " failed (Total: " + totalTests + ")");
    print("----------------------------------------------------------\n");
    return failedTests === 0;
}

// Export for GJS & Node
var AssertHarness = {
    describe: describe,
    it: it,
    assert: assert,
    assertEqual: assertEqual,
    assertDeepEqual: assertDeepEqual,
    assertGreaterThan: assertGreaterThan,
    summarize: summarize
};
