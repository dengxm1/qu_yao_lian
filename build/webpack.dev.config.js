const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.base.config.js');
const appConfig = require('./app.config.js');
const isWuHan = process.env.PLACE === 'wuhan';
const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: {
      index: isWuHan ? appConfig.absoluteWhPrefix : appConfig.absolutePrefix + 'index.html'
    },
    open: true,
    openPage: isWuHan ? appConfig.relativeWhPrefix : appConfig.relativePrefix,
    port: 9000,
    hot: true,
    overlay: {
      errors: true
    }
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
          }
        },
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true
          }
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].[hash:8].js',
    publicPath: isWuHan ? appConfig.absoluteWhPrefix : appConfig.absolutePrefix
  },
}

module.exports = merge(commonConfig, devConfig);
