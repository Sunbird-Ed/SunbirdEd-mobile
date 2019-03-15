var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var event = {
  register: function(success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["register"]);
  },

  unregister: function(success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["unregister"]);
  },

  action: function() {
    return "event";
  }
};

module.exports = event;
