module.exports = function (context) {
    var fs = require('fs');
    var path = require('path');

    try {
        //move the cordova js filrs and plugins for the app
        fs.renameSync("platforms/android/app/src/main/assets/www/cordova.js", "platforms/android/app/src/main/assets/www/sunbird/cordova.js");
        fs.renameSync("platforms/android/app/src/main/assets/www/cordova-js-src", "platforms/android/app/src/main/assets/www/sunbird/cordova-js-src");
        fs.renameSync("platforms/android/app/src/main/assets/www/cordova_plugins.js", "platforms/android/app/src/main/assets/www/sunbird/cordova_plugins.js");
        fs.renameSync("platforms/android/app/src/main/assets/www/plugins/", "platforms/android/app/src/main/assets/www/sunbird/plugins/"); 
    } catch (error) {
        console.log(error);
    }

    try {
        //rename config.xml for the app
        fs.renameSync("platforms/android/app/src/main/res/xml/config.xml", "platforms/android/app/src/main/res/xml/sunbird_config.xml");
    } catch (error) {
    }

    try {
        //deleting duplicate cordova files
        fs.unlinkSync("platforms/android/CordovaLib/src/org/apache/cordova/BuildHelper.java");
    } catch (error) {
    }
    try {
        fs.unlinkSync("platforms/android/CordovaLib/src/org/apache/cordova/PermissionHelper.java");
    } catch (error) {
    }

    try {
        //deleting duplicate keyboard plugin files
        fs.unlinkSync("platforms/android/app/src/main/java/io/ionic/keyboard/IonicKeyboard.java");
    } catch (error) {
    }

    try {
        //deleting duplicate device plugin files
        fs.unlinkSync("platforms/android/app/src/main/java/org/apache/cordova/device/Device.java");
    } catch (error) {
    }

    try {
        //deleting duplicate device plugin files
        fs.unlinkSync("platforms/android/app/src/main/java/org/apache/cordova/networkinformation/NetworkManager.java");
    } catch (error) {
    }

    var util = context.requireCordovaModule('cordova-lib/src/cordova/util');
    var ConfigParser =context.requireCordovaModule('cordova-common').ConfigParser
    var xml = new ConfigParser(util.projectConfig(util.isCordova()));


    var applicationId = xml.packageName();
    var applicationFile = applicationId.replace(/\./g , "\/");
    var mainActivity = "platforms/android/app/src/main/java/" + applicationFile + "/MainActivity.java";
    var replaceString = undefined;

    if (fs.existsSync(mainActivity)) {

        fs.readFile(mainActivity, 'utf8', function(err, data) {
            if (err) {
                throw new Error('Unable to find MainActivity.java: ' + err + ' ' + mainActivity);
            }

            fs.readFile("./plugins/cordova-plugin-geniecanvas/scripts/MainActivity.java", 'utf8', function(ferr, fdata) {
                var result = "package " + applicationId + ";\n".concat(fdata);
                fs.writeFileSync(mainActivity, result, 'utf8', (error) => {
                    console.log("MainActivity Write error");
                })
            });

        });

    }

    try {
        var rimraf = require('rimraf');
        //deleting file plugin duplicate dir
        rimraf("platforms/android/app/src/main/java/org/apache/cordova/file", function () {
            console.log("Deleted => platforms/android/app/src/main/java/org/apache/cordova/file");
        });
        //deleting filetransfer plugin duplicate dir
        rimraf("platforms/android/app/src/main/java/org/apache/cordova/filetransfer", function () {
            console.log("Deleted => platforms/android/app/src/main/java/org/apache/cordova/filetransfer");
        });
        //deleting inappbrowser plugin duplicate dir
        rimraf("platforms/android/app/src/main/java/org/apache/cordova/inappbrowser", function () {
            console.log("Deleted => platforms/android/app/src/main/java/org/apache/cordova/inappbrowser");
        });
        //deleting whitelist plugin duplicate dir
        rimraf("platforms/android/app/src/main/java/org/apache/cordova/whitelist", function () {
            console.log("Deleted => platforms/android/app/src/main/java/org/apache/cordova/whitelist");
        });
    } catch (error) {
        console.log(error);
    }
    
}