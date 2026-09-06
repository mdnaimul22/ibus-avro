const gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

imports.searchPath.unshift('..');
imports.searchPath.unshift('../src');
imports.searchPath.unshift('./src');
imports.searchPath.unshift('.');
const suggestion = imports.services.suggestion_engine;

try {
    print("Initializing SuggestionBuilder...");
    var sb = new suggestion.SuggestionBuilder();
    
    print("Initial dirty state: " + sb._dirty);
    print("Initial saveTimeoutId: " + sb._saveTimeoutId);
    
    // Simulate user selection commitment
    print("Simulating string selection commitment...");
    sb.stringCommitted("testkey", "আমারটেস্টশব্দ");
    
    print("Dirty state after commit: " + sb._dirty);
    print("Timeout ID after commit: " + sb._saveTimeoutId);
    
    if (sb._saveTimeoutId === 0) {
        throw new Error("Save timeout was not scheduled!");
    }
    
    // Wait for the timeout to trigger and flush to file
    print("Waiting 3 seconds for async flush to trigger...");
    var loop = new GLib.MainLoop(null, false);
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 3000, function() {
        loop.quit();
        return GLib.SOURCE_REMOVE;
    });
    loop.run();
    
    print("Checking dirty state after wait: " + sb._dirty);
    print("Checking timeout ID after wait: " + sb._saveTimeoutId);
    
    // Verify file content
    var path = GLib.get_home_dir() + "/.candidate-selections.json";
    var file = gio.File.new_for_path(path);
    if (file.query_exists(null)) {
        var file_stream = file.read(null);
        var data_stream = gio.DataInputStream.new(file_stream);
        var read_result = data_stream.read_until("", null);
        var read_json = read_result[0];
        
        // Search if the committed word is in raw UTF-8 inside the file
        if (read_json.indexOf("আমারটেস্টশব্দ") !== -1) {
            print("SUCCESS: Committed word was found in raw UTF-8 in the JSON file!");
        } else {
            print("FAILURE: Committed word was not found in the JSON file.");
        }
    } else {
        print("FAILURE: JSON file not found at " + path);
    }
    
} catch (e) {
    print("Error during verification: " + e);
}
