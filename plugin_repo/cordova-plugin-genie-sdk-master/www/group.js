var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var group = {

  createGroup: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["createGroup", requestJson]);
  },

  updateGroup: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["updateGroup", requestJson]);
  },

  deleteGroup: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["deleteGroup", requestJson]);
  },

  getAllGroup: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getAllGroup", requestJson]);
  },

  setCurrentGroup: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["setCurrentGroup", requestJson]);
  },

  getCurrentGroup: function (success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getCurrentGroup"]);
  },

  addUpdateProfilesToGroup: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["addUpdateProfilesToGroup", requestJson]);
  },

  action: function () {
    return "group";
  }

};

module.exports = group;