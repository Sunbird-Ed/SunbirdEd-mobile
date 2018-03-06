var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var auth = {
    
    getBearerToken: function (success, error) {
      exec(success, error, PLUGIN_NAME, this.action(), ["getMobileDeviceBearerToken"]);
    },

    startSession: function (session) {
      exec(null, null, PLUGIN_NAME, this.action(), ["startSession"]);
    },

    endSession: function () {
      exec(null, null, PLUGIN_NAME, this.action(), ["endSession"]);
    },

    isValidSession: function (success, error) {
      exec(success, error, PLUGIN_NAME, this.action(), ["isValidSession"]);
    },

    action: function () {
        return "auth";
    }
  };

  module.exports = auth;

