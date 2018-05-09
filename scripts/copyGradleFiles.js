module.exports = function (context) {
    var fs = require('fs');
    fs.copyFileSync("buildConfig/build-extras.gradle", "platforms/android/app/build-extras.gradle");
    fs.copyFileSync("buildConfig/sunbird.properties", "platforms/android/gradle.properties");
}