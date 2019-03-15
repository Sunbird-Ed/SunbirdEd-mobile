var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var dialcode = {

    getDialCode: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getDialCode", requestJson]);
    },

    action: function () {
        return "dialcode";
    }

};

module.exports = dialcode;

