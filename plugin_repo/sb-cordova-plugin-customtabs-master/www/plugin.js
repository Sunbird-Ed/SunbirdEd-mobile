var exec = require('cordova/exec');

var PLUGIN_NAME = 'customtabs';

var customtabs = {

    isAvailable: function(success, error) {
        exec(success, error, PLUGIN_NAME, "isAvailable", []);
    },

    launch: function(url, success, error) {
        exec(success, error, PLUGIN_NAME, "launch", [url]);
    },

    launchInBrowser: function(url, success, error) {
        exec(success, error, PLUGIN_NAME, "launchInBrowser", [url]);
    },

    close: function(success, error) {
        exec(success, error, PLUGIN_NAME, "close", []);
    },

};


module.exports = customtabs;
