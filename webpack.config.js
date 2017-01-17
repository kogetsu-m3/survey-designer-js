const path = require('path');
const webpack = require('webpack');

module.exports = {
  // devtool: 'cheap-module-eval-source-map',
  //devtool: 'inline-source-map',
  devtool: 'source-map',
  entry: {
    runtime: ['webpack-hot-middleware/client', './runtime/index'],
    editor: ['webpack-hot-middleware/client', './editor/index'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    /*
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
    */
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname,
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
      },
    ],
  },
  eslint: {
    configFile: '.eslintrc.json',
    fix: true,
  },
};


// When inside Redux repo, prefer src to compiled version.
// You can safely delete these lines in your project.
const reduxSrc = path.join(__dirname, '..', '..', 'src');
const reduxNodeModules = path.join(__dirname, '..', '..', 'node_modules');
const fs = require('fs');
if (fs.existsSync(reduxSrc) && fs.existsSync(reduxNodeModules)) {
  // Resolve Redux to source
  module.exports.resolve = { alias: { redux: reduxSrc } };
  // Compile Redux from source
  module.exports.module.loaders.push({
    test: /\.js$/,
    loaders: ['babel'],
    include: reduxSrc,
  });
}
