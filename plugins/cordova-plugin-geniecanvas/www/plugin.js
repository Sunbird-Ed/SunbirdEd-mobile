var exec = require('cordova/exec');

var PLUGIN_NAME = 'geniecanvas';

var geniecanvas = {
  play: function (playContent) {
    exec(null, null, PLUGIN_NAME, "play", [playContent]);
  },
};


module.exports = geniecanvas;
