var webpack = require('webpack');
var path = require('path');
const helpers = require('./helpers');

function root(localPath) {
  return path.resolve(__dirname, localPath);
}

module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
        loader: 'ts-loader'
      }, 'angular2-template-loader']
    },
    {
      test: /.+\.ts$/,
      exclude: [/(index.ts|mocks.ts|\.spec\.ts$)/,
        helpers.root('src/pages/home/home.ts'),
        helpers.root('src/pages/home/announcement-detail/announcement-detail.ts'),
        helpers.root('src/pages/home/announcement-list/announcement-list.ts'),
        helpers.root('src/pages/profile/imagepicker/imagepicker.ts'),
        helpers.root('src/component/card/home/home-announcement-card.ts'),
        helpers.root('src/directives/read-more/read-more.ts')],
      loader: 'istanbul-instrumenter-loader',
      enforce: 'post',
      query: {
        esModules: true
      }
    },
    {
      test: /\.html$/,
      loader: 'html-loader?attrs=false'
    },
    {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      loader: 'null-loader'
    }
    ]
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /(ionic-angular)|(angular(\\|\/)core(\\|\/)@angular)/,
      root('./src'), // location of your src
      {} // a map of your routes
    )
  ]
};
