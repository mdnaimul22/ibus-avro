#!/usr/bin/env gjs
// =============================================================================
// Integration Tests: Sandboxed Persistence & File I/O
// =============================================================================

imports.searchPath.unshift('./src');
imports.searchPath.unshift('../src');
imports.searchPath.unshift('./tests');
imports.searchPath.unshift('../tests');

const gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const Assert = imports.helpers.assert;
const describe = Assert.describe;
const it = Assert.it;
const assert = Assert.assert;
const assertEqual = Assert.assertEqual;

const Services = imports.services.index;
const Config = imports.config.index;

const SANDBOX_FILE = "/tmp/ibus-avro-test-candidate-selections-" + GLib.get_monotonic_time() + ".json";

function cleanupSandbox() {
    var file = gio.File.new_for_path(SANDBOX_FILE);
    if (file.query_exists(null)) {
        file.delete(null);
    }
}

describe("Integration Layer - Sandboxed Persistence", function() {

    it("Candidate selections are debounced and saved to sandboxed JSON file", function() {
        cleanupSandbox();

        var sb = new Services.SuggestionEngine();
        sb._candidateSelections = {};

        // Custom flush pointing to sandbox file
        sb._flushSave = function() {
            if (!this._dirty) return;
            this._dirty = false;
            this._pruneCandidateSelections();
            var json = JSON.stringify(this._candidateSelections, null, Config.Settings.JSON_INDENT);
            var bytes = GLib.Bytes.new(json);
            var file = gio.File.new_for_path(SANDBOX_FILE);
            file.replace_contents(bytes.get_data(), null, false, gio.FileCreateFlags.NONE, null);
        };

        // Simulate user committing a word
        sb.stringCommitted("amar_key", "আমারশব্দ");
        assertEqual(sb._dirty, true, "Dirty state must be true after commit");

        // Flush to sandbox file
        sb._flushSave();

        var file = gio.File.new_for_path(SANDBOX_FILE);
        assert(file.query_exists(null), "Sandbox file should exist after flush");

        // Read and verify raw UTF-8 content
        var stream = file.read(null);
        var dataStream = gio.DataInputStream.new(stream);
        var content = dataStream.read_until("", null)[0];
        assert(content.indexOf("আমারশব্দ") !== -1, "Committed word must be present in raw UTF-8");
        assert(content.indexOf("amar_key") !== -1, "Key must be present in JSON");
    });

    it("Candidate selections reload correctly from sandboxed file", function() {
        var sb2 = new Services.SuggestionEngine();
        sb2._candidateSelections = {};

        // Custom loader from sandbox file
        var file = gio.File.new_for_path(SANDBOX_FILE);
        if (file.query_exists(null)) {
            var stream = file.read(null);
            var dataStream = gio.DataInputStream.new(stream);
            var content = dataStream.read_until("", null)[0];
            sb2._candidateSelections = JSON.parse(content) || {};
        }

        var entry = sb2._candidateSelections["amar_key"];
        assert(entry !== undefined, "Reloaded entry should exist");
        assertEqual(entry["আমারশব্দ"].freq, 1, "Reloaded selection frequency should be 1");

        cleanupSandbox();
    });

});

if (!Assert.summarize()) {
    cleanupSandbox();
    imports.system.exit(1);
}
