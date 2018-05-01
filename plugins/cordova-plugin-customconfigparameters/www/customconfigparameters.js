var exec = require('cordova/exec');
function CustomConfigParameters () {

}
CustomConfigParameters.prototype.get = function (successCallback, errorCallback,keyArray) {
       exec(successCallback, errorCallback, "CustomConfigParameters", "get", keyArray);
};

module.exports = new CustomConfigParameters();