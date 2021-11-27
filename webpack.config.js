const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const packageJson = require('./package.json')

module.exports = {
  mode: process.env.NODE_ENV || 'production', // devlopment || production
  target: 'web',
  entry: {
    'lrc-file-parser': path.join(__dirname, './src/index.js'),
    'lrc-file-parser.min': path.join(__dirname, './src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'umd',
    library: 'Lyric',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin(`lrc-file-parser.js v${packageJson.version}
Author: lyswhut
Github: https://github.com/lyswhut/lrc-file-parser
License: MIT`,
    ),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        include: [/\.min\.js$/],
      }),
    ],
  },
}
