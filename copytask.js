module.exports = function (context) {
    var fs = require('fs');
    try {
        //move the cordova js filrs and plugins for the app
        fs.renameSync("platforms/android/assets/www/cordova.js", "platforms/android/assets/www/sunbird/cordova.js");
        fs.renameSync("platforms/android/assets/www/cordova-js-src", "platforms/android/assets/www/sunbird/cordova-js-src");
        fs.renameSync("platforms/android/assets/www/cordova_plugins.js", "platforms/android/assets/www/sunbird/cordova_plugins.js");
        fs.renameSync("platforms/android/assets/www/plugins/", "platforms/android/assets/www/sunbird/plugins/"); 
    } catch (error) {
        console.log(error);
    }
}


