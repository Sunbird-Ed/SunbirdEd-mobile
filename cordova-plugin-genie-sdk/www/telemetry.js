var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var telemetry = {

  audit: function(auditJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveAudit", auditJson]);
  },


  start: function(startJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveStart", startJson]);
  },

  end: function(endJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveEnd", endJson]);
  },

  error: function(errorJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveError", errorJson]);
  },

  exdata: function(exdataJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveExdata", exdataJson]);
  },

  feedback: function(feedbackJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveFeedback", feedbackJson]);
  },

  impression: function(impressionJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveImpression", impressionJson]);
  },

  interact: function(interactJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveInteract", interactJson]);
  },

  interrupt: function(interruptJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveInterrupt", interruptJson]);
  },

  log: function(logJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveLog", logJson]);
  },

  search: function(searchJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveSearch", searchJson]);
  },

  share: function(shareJson, cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ["saveShare", shareJson]);
  },

  sync: function(cb) {
    exec(cb, null, PLUGIN_NAME, this.action(), ['sync']);
  },

  action: function() {
    return "telemetry";
  }
};

module.exports = telemetry;
