webpack = require 'webpack'

config =
  entry:
    dev: 'webpack/hot/dev-server'
    js: __dirname + '/app/bootstrap.coffee'
  output:
    path: __dirname + '/app'
    filename: 'bundle.js'
  devServer:
    contentBase: __dirname + '/app'
    hot: true
  module:
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'coffeescript', template: 'jade' } }
    ]
    loaders: [
      {test: /\.coffee$/, loader: 'coffee-loader'}
      {test: /\.jade$/, loader: 'jade-loader?self'}
    ]
  resolve:
    extensions: ['', '.js', '.json', '.coffee']
  plugins: [
    new webpack.DefinePlugin(
      ON_TEST: process.env.NODE_ENV == 'test'
    )
    new webpack.ProvidePlugin(
      riot: 'riot'
      $: 'jquery'
      ripple: 'ripple-lib'
      kefir: 'kefir'
    )
  ]

if process.env.NODE_ENV == 'production'
  config.output.path = __dirname + '/dist'
  config.plugins.push new webpack.optimize.UglifyJsPlugin

module.exports = config