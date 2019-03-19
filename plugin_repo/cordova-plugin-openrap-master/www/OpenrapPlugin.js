var exec = require("cordova/exec");

var PLUGIN_NAME = "openrap";

var openrap = {
  startDiscovery: function(success, error) {
    exec(success, error, PLUGIN_NAME, PLUGIN_NAME,["startDiscovery"]);
  }
};

module.exports = openrap;