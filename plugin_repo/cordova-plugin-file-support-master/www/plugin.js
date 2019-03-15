var exec = require('cordova/exec');

var PLUGIN_NAME = 'supportfile';

var supportfile = {
  makeEntryInSunbirdSupportFile: function (success, error) {
    exec(success, error, PLUGIN_NAME, PLUGIN_NAME, ["makeEntryInSunbirdSupportFile"]);
  },
  shareSunbirdConfigurations: function (success, error) {
    exec(success, error, PLUGIN_NAME, PLUGIN_NAME, ["shareSunbirdConfigurations"]);
  },
  removeFile: function (success, error) {
    exec(success, error, PLUGIN_NAME, PLUGIN_NAME, ["removeFile"]);
  },
};


module.exports = supportfile;
