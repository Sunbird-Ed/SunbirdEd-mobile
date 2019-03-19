var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var form = {

    getForm: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getForm", requestJson]);
    },

    action: function () {
        return "form";
    }

};

module.exports = form;

