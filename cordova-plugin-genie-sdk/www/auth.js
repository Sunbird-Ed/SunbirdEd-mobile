var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var auth = {
    
    auth: function name(success, error) {
      exec(success, error, PLUGIN_NAME, this.action(), []);
    },

    action: function () {
        return "auth";
    }
  };

  module.exports = auth;

