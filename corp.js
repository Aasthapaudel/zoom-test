const webpack = require('webpack');
const fs = require('fs');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.dev');

const args = process.argv.slice(2);
let https = false;
if (args.includes('--https')) https = true;

function runFunc(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at http://127.0.0.1:8000/index.html');
}

new WebpackDevServer(
  {
    port: 8000, // Changed from 9999 to 8000
    host: '0.0.0.0',
    open: https ? 'https://localhost:8000/' : 'http://127.0.0.1:8000/',
    server: {
      type: https ? 'https' : 'http',
      options: {
        cert: fs.readFileSync('./localhost.crt'),
        key: fs.readFileSync('./localhost.key')
      },
    },
    headers: {
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    historyApiFallback: true,
    proxy: [
      {
        path: '/meeting.html',
        target: 'http://127.0.0.1:8001/' // Changed target from 9998 to 8001
      }
    ],
    static: './',
    allowedHosts: 'all'
  },
  webpack(webpackConfig)
).start(8000, '0.0.0.0', runFunc);

new WebpackDevServer(
  {
    port: 8001, // Changed from 9998 to 8001
    host: '0.0.0.0',
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    },
    historyApiFallback: true,
    static: './'
  },
  webpack(webpackConfig)
).start(8001, '0.0.0.0', runFunc);
