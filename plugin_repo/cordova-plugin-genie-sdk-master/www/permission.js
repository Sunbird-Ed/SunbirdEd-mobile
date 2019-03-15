var exec = require('cordova/exec');

var PLUGIN_NAME = 'GenieSDK';

var permission = {
	hasPermission: function(requestJson, success, error) {
		exec(success, error, PLUGIN_NAME, this.action(), ["hasPermission", requestJson]);
	},
	
	requestPermission: function(requestJson, success, error) {
		exec(success, error, PLUGIN_NAME, this.action(), ["requestPermission", requestJson]);
	},

	action: function() {
		return "permission";
	}
}

module.exports = permission;