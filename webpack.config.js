const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const devConfig = require('./build/webpack.dev.config.js');
const prodConfig = require('./build/webpack.prod.config.js');
const ip = require('ip').address();
const portFinder = require('portfinder');
const isDev = process.env.NODE_ENV === 'development';
const devWebpackConfig = merge(devConfig, {
  devServer: {
    host: ip, // 是否可以ip访问
    disableHostCheck: true, // 是否可以ip访问
    proxy: {
      '/api/scan': {
        target: 'http://121.196.59.132:9097', //测试外网
        changeOrigin: true,
        pathRewrite: {
          '^/api/scan': ''
        }
      },
      '/api': {
        target: 'http://8.130.164.24:9090/', //测试外网--衢药链
        //target: 'http://121.196.59.132:9097', //测试外网--食涟
        // target: 'http://k2fhx5.natappfree.cc', // 穿透网址
        // target: 'http://223.4.78.159:9100/api', // 正式内网
        // target: 'http://59.202.53.179:9097', // 测试内网
        // target: 'http://59.202.53.179:9099', // 预发内网
        //  target: 'http://59.202.53.179:9097', // 测试内网
        // target: 'http://192.168.2.103:9097', //嘉祎本地
        // target: 'http://192.168.1.128:9097', //周帅本地
        // target: 'http://192.168.1.133:9097',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
});
if (isDev) {
  module.exports = new Promise((resolve, reject) => {
    portFinder.getPort({ port: 9000, stopPort: 9999 }, function(err, port) {
      if (err) {
        reject(err);
      } else {
        devWebpackConfig.devServer.port = port;
        resolve(devWebpackConfig);
      }
    });
  });
} else {
  if (process.env.BUILD_REPORT) {
    module.exports = merge(prodConfig, {
      plugins: [new BundleAnalyzerPlugin()]
    });
  } else {
    module.exports = prodConfig;
  }
}