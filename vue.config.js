const resolve = require('path').resolve

module.exports = {
  baseUrl: '/dist',
  outputDir: './chrome-extension/dist',
  configureWebpack: config => {
    config.resolve.alias['chrome_js'] = resolve('./chrome-extension-src/js')
  }
}