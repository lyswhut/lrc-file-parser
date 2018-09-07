const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: process.env.NODE_ENV || 'production', // devlopment || production
  target: 'web',
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'lrc-parser.min.js',
    path: path.join(__dirname, './dist'),
    libraryTarget: 'umd',
    library: 'Lyric'
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
    new webpack.BannerPlugin(`
Author: lyswhut
Email：lyswhut@qq.com
Github：https://github.com/lyswhut/lrc-parser
License: MIT
`
    )
  ],
}
