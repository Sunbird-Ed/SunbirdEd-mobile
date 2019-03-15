var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var report = {

    getListOfReports: function (uids, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getListOfReports", uids]);
    },

    getDetailReport: function (uids, contentId, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getDetailReport", uids, contentId]);
    },

    getReportsByUser: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getReportsByUser", requestJson]);
    },

    getReportsByQuestion: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getReportsByQuestion", requestJson]);
    },

    getDetailsPerQuestion: function (requestJson, success, error) {
        exec(success, error, PLUGIN_NAME, this.action(), ["getDetailsPerQuestion", requestJson]);
    },

    action: function () {
        return "report";
    }

};

module.exports = report;

