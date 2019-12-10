const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const packageJson = require('./package.json')

module.exports = {
  mode: process.env.NODE_ENV || 'production', // devlopment || production
  target: 'web',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'lrc-file-parser.min.js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'umd',
    library: 'Lyric',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(`lrc-file-parser.js v${packageJson.version}
Author: lyswhut
Github: https://github.com/lyswhut/lrc-file-parser
License: MIT`
    )
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
        extractComments: false
      }),
    ],
  }
}
