const baseConfig = require('./webpack.config')
const nodeExternals = require('webpack-node-externals')

module.exports = {...baseConfig,
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()] // in order to ignore all modules in node_modules folder
}
