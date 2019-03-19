var exec = require('cordova/exec');

var PLUGIN_NAME = 'geniecanvas';

var geniecanvas = {
  play: function (playContent , extraInfo) {
    exec(null, null, PLUGIN_NAME, "play", [playContent,extraInfo]);
  },
};


module.exports = geniecanvas;
