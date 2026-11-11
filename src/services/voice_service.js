const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Config = imports.config.index;

var VoiceService = function() {
    this.recording = false;
    this.transcribing = false;
    this.recordProcess = null;
    this.wavPath = "/tmp/avro_voice_record.wav";
};

VoiceService.prototype = {
    startRecording: function() {
        if (this.recording || this.transcribing) return false;
        var file = Gio.File.new_for_path(this.wavPath);
        if (file.query_exists(null)) {
            try { file.delete(null); } catch (e) {}
        }
        try {
            this.recordProcess = new Gio.Subprocess({
                argv: ["arecord", "-q", "-f", "S16_LE", "-r", "16000", "-c", "1", this.wavPath],
                flags: Gio.SubprocessFlags.NONE
            });
            this.recordProcess.init(null);
            this.recording = true;
            return true;
        } catch (e) {
            this.recording = false;
            this.recordProcess = null;
            return false;
        }
    },

    stopAndTranscribe: function(serverUrl, apiKey, onResult, onError) {
        if (!this.recording || !this.recordProcess) {
            if (onError) onError("Not recording");
            return;
        }
        this.recording = false;
        this.transcribing = true;

        var proc = this.recordProcess;
        this.recordProcess = null;
        var that = this;

        try {
            proc.send_signal(2);
        } catch (e) {}

        proc.wait_check_async(null, function(source, res) {
            try {
                source.wait_check_finish(res);
            } catch (e) {}
            that._sendTranscription(serverUrl, apiKey, onResult, onError);
        });
    },

    _sendTranscription: function(serverUrl, apiKey, onResult, onError) {
        var base = (serverUrl && serverUrl.length > 0) ? serverUrl : Config.Settings.DEFAULT_VOICE_SERVER_URL;
        var endpoint = base.replace(/\/+$/, "") + "/v1/audio/transcriptions";
        var token = (apiKey && apiKey.length > 0) ? apiKey : Config.Settings.DEFAULT_VOICE_API_KEY;
        var that = this;

        var argv = [
            "curl", "-k", "-s", "--max-time", "15", "-X", "POST",
            endpoint,
            "-H", "Authorization: Bearer " + token,
            "-F", "file=@" + this.wavPath,
            "-F", "language=bn"
        ];

        try {
            var curlProc = new Gio.Subprocess({
                argv: argv,
                flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
            });
            curlProc.init(null);

            curlProc.communicate_utf8_async(null, null, function(source, res) {
                that.transcribing = false;
                try {
                    var [, stdout, stderr] = source.communicate_utf8_finish(res);
                    var data = JSON.parse(stdout);
                    if (data && typeof data.text === "string" && data.text.length > 0) {
                        if (onResult) onResult(data.text);
                    } else {
                        if (onError) onError(stdout || "Empty transcription");
                    }
                } catch (err) {
                    if (onError) onError(err.message);
                }
            });
        } catch (err) {
            that.transcribing = false;
            if (onError) onError(err.message);
        }
    },

    cancel: function() {
        if (this.recordProcess) {
            try { this.recordProcess.send_signal(9); } catch (e) {}
            this.recordProcess = null;
        }
        this.recording = false;
        this.transcribing = false;
        var file = Gio.File.new_for_path(this.wavPath);
        if (file.query_exists(null)) {
            try { file.delete(null); } catch (e) {}
        }
    }
};
