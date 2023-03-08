const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { HotModuleReplacementPlugin } = require("webpack");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    port: 3001,
    static: '../dist',
    hot: true
  },
  optimization: {
    minimize: false,
    concatenateModules: false
  },
  module: {
    rules: [
      {
        test: /\.css$|sass|scss/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin()
  ]
});