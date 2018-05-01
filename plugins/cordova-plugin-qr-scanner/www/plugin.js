var exec = require('cordova/exec');

var PLUGIN_NAME = 'qrScanner';

var qrScanner = {
  startScanner: function (screenTitle, displayText, displayTextColor, success, error) {
    exec(success, error, PLUGIN_NAME, PLUGIN_NAME, ["startScanner", screenTitle, displayText, displayTextColor]);
  },

  stopScanner: function (success, error) {
    exec(success, error, PLUGIN_NAME, PLUGIN_NAME, ["stopScanner"]);
  },
};


module.exports = qrScanner;
