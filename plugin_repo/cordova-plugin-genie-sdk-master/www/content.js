var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var content = {

  getContentDetail: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getContentDetail", requestJson]);
  },

  importEcar: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["importEcar", requestJson]);
  },

  importContent: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["importContent", requestJson]);
  },

  searchContent: function (requestJson, isFilterApplied, isDialCodeSearch, isGuestUser, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["searchContent", requestJson, isFilterApplied, isDialCodeSearch, isGuestUser]);
  },

  getAllLocalContents: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getAllLocalContents", requestJson]);
  },

  getChildContents: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getChildContents", requestJson]);
  },

  deleteContent: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["deleteContent", requestJson]);
  },

  flagContent: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["flagContent", requestJson]);
  },

  sendFeedback: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["sendFeedback", requestJson]);
  },

  getImportStatus: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getImportStatus", requestJson]);
  },

  cancelDownload: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["cancelDownload", requestJson]);
  },

  exportContent: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["exportContent", requestJson]);
  },

  setDownloadAction: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["setDownloadAction", requestJson]);
  },

  getDownloadState: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getDownloadState", requestJson]);
  },

  getSearchCriteriaFromRequest: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getSearchCriteriaFromRequest", requestJson]);
  },

  getLocalContents: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getLocalContents", requestJson]);
  },

  setContentMarker: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["setContentMarker", requestJson]);
  },

  action: function () {
    return "content";
  }
};

module.exports = content;
