var exec = require('cordova/exec');

var PLUGIN_NAME = 'imagechooser';

var imagechooser = {
  chooseImage: function (success, error) {
    exec(success, error, PLUGIN_NAME, PLUGIN_NAME, ["chooseImage"]);
  },
};


module.exports = imagechooser;
