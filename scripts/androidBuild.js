module.exports = function(context) {
    var fs = require('fs');
    fs.createReadStream('scripts/build-extras.gradle').pipe(fs.createWriteStream('platforms/android/build-extras.gradle'));
}