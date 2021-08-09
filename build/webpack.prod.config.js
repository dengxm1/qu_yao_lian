const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const appConfig = require('./app.config.js');
const commonConfig = require('./webpack.base.config.js');

function getRelativePrefix() {
  switch (process.env.PLACE) {
    case 'wuhan':
      return appConfig.relativeWhPrefix;
    default: 
      return appConfig.relativePrefix;
  }
}

const prodConfig = (module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserJSPlugin({
        cache: true,
        sourceMap: true,
        parallel: 4
      })
    ],
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '.',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: getRelativePrefix() + 'css/[name].[contenthash:8].css'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: getRelativePrefix() + 'static',
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../styles'),
        to: appConfig.relativePrefix + 'styles',
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../file'),
        to: appConfig.relativePrefix + 'file',
        ignore: ['.*']
      },
    ])
  ],
  output: {
    filename: getRelativePrefix() + 'js/[name].[chunkhash:8].js',
    chunkFilename: getRelativePrefix() + 'js/[name].[chunkhash:8].js',
    publicPath: appConfig.prodPublicPath  || '/'
  }
});
module.exports = merge(commonConfig, prodConfig);
