var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var telemetry = {
    
    impression: function(impressionJson, cb) {
      exec(cb, null, PLUGIN_NAME, this.action(), ["saveImpression", impressionJson]);
    },
    
    sync: function(cb) {
      exec(cb, null, PLUGIN_NAME, this.action(), ['sync']);
    },

    action: function () {
        return "telemetry";
    }
  };

  module.exports = telemetry;

