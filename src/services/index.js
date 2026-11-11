const suggestionEngine = imports.services.suggestion_engine;
const voiceService = imports.services.voice_service;

var SuggestionEngine = suggestionEngine.SuggestionBuilder;
var VoiceService = voiceService.VoiceService;
var Services = {
    SuggestionEngine: suggestionEngine.SuggestionBuilder,
    VoiceService: voiceService.VoiceService
};
