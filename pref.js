/*
    =============================================================================
    *****************************************************************************
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.

    Software distributed under the License is distributed on an "AS IS"
    basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
    License for the specific language governing rights and limitations
    under the License.

    The Original Code is ibus-avro

    The Initial Developer of the Original Code is
    Sarim Khan <sarim2005@gmail.com>

    Copyright (C) Sarim Khan (http://www.sarimkhan.com). All Rights Reserved.


    Contributor(s): ______________________________________.

    *****************************************************************************
    =============================================================================
*/

imports.gi.versions.Gtk = '3.0';
imports.searchPath.unshift('/usr/share/ibus-avro/src');
imports.searchPath.unshift('./src');
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const Config = imports.config.index;
const paths = Config.Paths;

var prefwindow, switch_preview, switch_newline, switch_dict, lutable_size, cboxorient, scale1;
var switch_voice, entry_voice_url, entry_voice_key;

function runpref() {

    Gtk.init(null);
    let builder = new Gtk.Builder();
    let ui_file = paths.get_pkgdatadir() + "/src/ui/avropref.ui";
    let file = Gio.File.new_for_path(ui_file);
    if (!file.query_exists(null)) {
        ui_file = "./src/ui/avropref.ui";
    }
    builder.add_from_file(ui_file);

    prefwindow = builder.get_object("window1");
    switch_preview = builder.get_object("switch_preview");
    switch_newline = builder.get_object("switch_newline");
    switch_dict = builder.get_object("switch_dict");
    lutable_size = builder.get_object("lutable_size"); 
    scale1 = builder.get_object("scale1"); 
    cboxorient = builder.get_object("cboxorient");
    switch_voice = builder.get_object("switch_voice");
    entry_voice_url = builder.get_object("entry_voice_url");
    entry_voice_key = builder.get_object("entry_voice_key");
    
    switch_preview.connect("notify::active", validate);
    switch_newline.connect("notify::active", validate);
    switch_dict.connect("notify::active", validate);
    switch_voice.connect("notify::active", validateVoice);

    let setting = Gio.Settings.new(Config.Settings.SCHEMA_ID);
    setting.bind("switch-preview", switch_preview, "active", Gio.SettingsBindFlags.DEFAULT);
    setting.bind("switch-dict", switch_dict, "active", Gio.SettingsBindFlags.DEFAULT);
    setting.bind("switch-newline", switch_newline, "active", Gio.SettingsBindFlags.DEFAULT);
    setting.bind("lutable-size", lutable_size, "value", Gio.SettingsBindFlags.DEFAULT);
    setting.bind("cboxorient", cboxorient, "active", Gio.SettingsBindFlags.DEFAULT);
    setting.bind(Config.Settings.KEY_VOICE_ENABLED, switch_voice, "active", Gio.SettingsBindFlags.DEFAULT);
    setting.bind(Config.Settings.KEY_VOICE_SERVER_URL, entry_voice_url, "text", Gio.SettingsBindFlags.DEFAULT);
    setting.bind(Config.Settings.KEY_VOICE_API_KEY, entry_voice_key, "text", Gio.SettingsBindFlags.DEFAULT);

    validate();
    validateVoice();

    prefwindow.connect("destroy", function() { Gtk.main_quit(); });
    prefwindow.show_all();

    Gtk.main();
}

function validateVoice() {
    let active = switch_voice.get_active();
    entry_voice_url.sensitive = active;
    entry_voice_key.sensitive = active;
}

function validate(){
    if (!switch_preview.get_active()){
        switch_newline.set_active(false);
        switch_dict.set_active(false);

        switch_dict.sensitive = false;
        switch_newline.sensitive = false;
        scale1.sensitive = false;
        cboxorient.sensitive = false;
    } else {
        switch_dict.sensitive = true;
        switch_newline.sensitive = true;
        scale1.sensitive = true;
        cboxorient.sensitive = true;
    }
}

//check if running standalone
if(ARGV[0] == '--standalone'){
    //running standalone, so no one to call me,calling myself
    runpref();
}
