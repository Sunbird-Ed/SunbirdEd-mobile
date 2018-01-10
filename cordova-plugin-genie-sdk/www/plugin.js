
var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var GenieSDK = {
  saveImpresseionTelemetry: function(type, subType, pageId, cb) {
    exec(cb, null, PLUGIN_NAME, 'saveImpresseionTelemetry', [type, subType, pageId]);
  },
  syncTelemetry: function(cb) {
    exec(cb, null, PLUGIN_NAME, 'syncTelemetry', []);
  }
};

module.exports = GenieSDK;
