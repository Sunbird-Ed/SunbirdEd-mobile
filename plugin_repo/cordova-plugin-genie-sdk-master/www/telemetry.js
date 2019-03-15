var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var telemetry = {

  audit: function (auditJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveAudit", auditJson]);
  },


  start: function (startJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveStart", startJson]);
  },

  end: function (endJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveEnd", endJson]);
  },

  error: function (errorJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveError", errorJson]);
  },

  exdata: function (exdataJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveExdata", exdataJson]);
  },

  feedback: function (feedbackJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveFeedback", feedbackJson]);
  },

  impression: function (impressionJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveImpression", impressionJson]);
  },

  interact: function (interactJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveInteract", interactJson]);
  },

  interrupt: function (interruptJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveInterrupt", interruptJson]);
  },

  log: function (logJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveLog", logJson]);
  },

  search: function (searchJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveSearch", searchJson]);
  },

  share: function (shareJson) {
    exec(null, null, PLUGIN_NAME, this.action(), ["saveShare", shareJson]);
  },

  sync: function (success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ['sync']);
  },

  getTelemetryStat: function (success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ['getTelemetryStat']);
  },

  action: function () {
    return "telemetry";
  }
};

module.exports = telemetry;
