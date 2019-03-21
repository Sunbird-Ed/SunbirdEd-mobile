var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var pageAssemble = {

  getPageAssemble: function(requestJson, success, error) {
    exec(success, error, PLUGIN_NAME, this.action(), ["getPageAssemble", requestJson]);
  },

  action: function() {
    return "pageAssemble";
  }
};

module.exports = pageAssemble;
