var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var content = {
    
    getContentDetail: function(requestJson, success, error) {
      exec(success, error, PLUGIN_NAME, this.action(), ["getContentDetail", requestJson]);
    },
    
    action: function () {
        return "content";
    }
  };

  module.exports = content;

