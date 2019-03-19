var exec = require("cordova/exec");

var PLUGIN_NAME = 'GenieSDK';

var genieSdkUtil = {
    getDeviceID: function (success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getDeviceID"]);
    },

    getLocation: function (success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getLocation"]);
    },

    isConnected: function (success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["isConnected"]);
    },

    isConnectedOverWifi: function (success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["isConnectedOverWifi"]);
    },

    getBuildConfigParam: function (param,success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getBuildConfigParam",param]);
      },

    decode: function (encodedString, flag, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["decode",encodedString,flag]);
      },

    openPlayStore: function(appId, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["openPlayStore", appId]);
    },

    getDeviceAPILevel: function(success,error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getDeviceAPILevel"]);
    },

    checkAppAvailability: function(packageName, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["checkAppAvailability", packageName]);
    },

    getDownloadDirectoryPath: function(success,error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getDownloadDirectoryPath"]);
    },

    action: function () {
        return "genieSdkUtil";
    }
};

module.exports = genieSdkUtil;