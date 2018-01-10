var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
  useDefaultConfig.prod.devtool = 'source-map';
  return useDefaultConfig;
}