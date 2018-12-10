const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    content_script: './chrome-extension-src/js/content_script.js',
    background: './chrome-extension-src/js/background.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'chrome-extension/js/')
  },
  plugins: [
  ],
  devtool: 'source-map'
}