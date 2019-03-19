var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var announcement = {

  getAnnouncementDetails: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getAnnouncementDetails", requestJson]);
  },

  getAnnouncementList: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getAnnouncementList", requestJson]);
  },

  updateAnnouncementState: function (requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["updateAnnouncementState", requestJson]);
  },

  action: function () {
    return "announcement";
  }

};

module.exports = announcement;

