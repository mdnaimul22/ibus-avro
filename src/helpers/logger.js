// =============================================================================
// Unified Logger for IBus Avro
// =============================================================================

function log(message, layer) {
    var prefix = layer ? "[" + layer + "] " : "[IBus-Avro] ";
    print(prefix + message);
}

function error(err, context) {
    var ctx = context ? " (" + context + ")" : "";
    printerr("[IBus-Avro ERROR]" + ctx + ": " + (err && err.message ? err.message : err));
}
