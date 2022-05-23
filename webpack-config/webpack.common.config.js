const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  entry: {
    app: './src/js/index.js'
  },
  module: {
    rules: [
      {
        test: [/\.js$/],
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ]
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          {
            loader: 'css-loader',
            options: { url: false }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              additionalData: '$env: ' + process.env.NODE_ENV + ';'
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        exclude: [/node_modules/, /login/],
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'img'
          },
        },
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.php',
      filename: '../index.php',
      inject: false
    }),
    new WebpackManifestPlugin({
      fileName: ('../manifest.json'),
      publicPath: '',
      filter: (file) => {
        if (file.path.match(/..\/img/) || file.path.match(/.php/) || file.path.match(/.py/)|| file.path.match(/.qpt/) || file.path.match(/..\/lang/) || file.path.match(/..\/fonts/) || file.path.match(/..\/login/) ) {
          return false;
        }
        return true;
      },
      map: (file) => {
        if (file.path.match(/css/)) {
          file.path = file.path.replace('../', './');
        } else if (file.path.match(/.js/)) {
          file.path = './js/' + file.path;
        }
        return file;
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/img',
          to: '../img'
        },
        {
          from: './src/php',
          to: '../php'
        },
        {
          from: './src/data',
          to: '../data'
        }
      ]
    })
  ]
};