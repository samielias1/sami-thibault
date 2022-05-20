const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

const webpackBaseConfig = require('./webpack.common.config.js');

module.exports = merge(webpackBaseConfig, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../docker/web/public-html/js'),
    filename: '[name].[chunkhash].js',
    clean: true
  },
  devtool: 'source-map',
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].css'
    })
  ]
});
