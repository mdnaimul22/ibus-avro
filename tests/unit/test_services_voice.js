#!/usr/bin/env gjs
imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');
imports.searchPath.unshift('./tests');
imports.searchPath.unshift('../tests');

const Assert = imports.helpers.assert;
const describe = Assert.describe;
const it = Assert.it;
const assert = Assert.assert;
const assertEqual = Assert.assertEqual;

const Services = imports.services.index;
const Config = imports.config.index;

describe("Services Layer - VoiceService", function() {

    it("VoiceService initializes in clean idle state", function() {
        var vs = new Services.VoiceService();
        assert(vs !== undefined, "VoiceService instance should be defined");
        assertEqual(vs.recording, false, "recording flag should be false initially");
        assertEqual(vs.transcribing, false, "transcribing flag should be false initially");
        assertEqual(vs.recordProcess, null, "recordProcess should be null initially");
    });

    it("stopAndTranscribe triggers error callback when not recording", function() {
        var vs = new Services.VoiceService();
        var errorCalled = false;
        vs.stopAndTranscribe("https://test.server", "test-key", function() {}, function(err) {
            errorCalled = true;
            assertEqual(err, "Not recording", "Should report not recording");
        });
        assert(errorCalled, "onError callback should be called");
    });

    it("cancel resets state and nullifies process handle", function() {
        var vs = new Services.VoiceService();
        vs.recording = true;
        vs.transcribing = true;
        vs.cancel();
        assertEqual(vs.recording, false, "recording should be reset to false");
        assertEqual(vs.transcribing, false, "transcribing should be reset to false");
        assertEqual(vs.recordProcess, null, "process should be null");
    });

});

if (!Assert.summarize()) {
    imports.system.exit(1);
}
