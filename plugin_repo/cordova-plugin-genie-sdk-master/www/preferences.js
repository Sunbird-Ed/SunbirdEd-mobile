var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var preferences = {

  getString: function (key, success) {
    exec(success, null, PLUGIN_NAME, this.action(), ["getString", key]);
  },

  getStringWithoutPrefix: function (key, success) {
    exec(success, null, PLUGIN_NAME, this.action(), ["getStringWithoutPrefix", key]);
  },

  putString: function (key, value, success) {
    exec(success, null, PLUGIN_NAME, this.action(), ["putString", key, value]);
  },

  action: function () {
    return "preferences";
  }

};

module.exports = preferences;

