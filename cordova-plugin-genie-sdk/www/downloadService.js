var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var downloadService = {

    getDownloadRequest: function (requestJson, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["getDownloadRequest", requestJson]);
    },

    getDownloadProgress: function (progressJson, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["getDownloadProgress", progressJson]);
    },

    cancelDownload: function (cancelRequest, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["cancelDownload", cancelRequest]);
    },

    enqueue: function (enqueueRequest, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["enqueue", enqueueRequest]);
    },

    downloadComplete: function (downloadCompleteRequest, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["downloadComplete", downloadCompleteRequest]);
    },

    downloadFailed: function (downloadFailRequest, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["downloadFailed", downloadFailRequest]);
    },

    resumeDownloads: function (resumeDownloadRequest, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["resumeDownloads", resumeDownloadRequest]);
    },

    removeDownloadFile: function (resumeDownloadFileRequest, cb) {
        exec(cb, null, PLUGIN_NAME, this.action(), ["removeDownloadFile", resumeDownloadFileRequest]);
    },


    action: function () {
        return "downloadService";
    }
};

module.exports = downloadService;