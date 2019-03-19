var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var profile = {

  createProfile: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["createProfile", requestJson]);
  },

  updateProfile: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["updateProfile", requestJson]);
  },

  setCurrentUser: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["setCurrentUser", requestJson]);
  },

  getCurrentUser: function (success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getCurrentUser"]);
  },

  setCurrentProfile: function (isGuestMode, requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["setCurrentProfile", isGuestMode, requestJson]);
  },

  setAnonymousUser: function (success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["setAnonymousUser"]);
  },

  addContentAccess: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["addContentAccess", requestJson]);
  },

  getAllUserProfile: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getAllUserProfile", requestJson]);
  },

  deleteUser: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["deleteUser", requestJson]);
  },

  importProfile: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["importProfile", requestJson]);
  },

  exportProfile: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["exportProfile", requestJson]);
  },

  getProfile: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getProfile", requestJson]);
  },

  action: function () {
    return "profile";
  }

};

module.exports = profile;