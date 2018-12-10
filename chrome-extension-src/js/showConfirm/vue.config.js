module.exports = {
  css: { extract: false },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
        .loader('url-loader')
        .tap(options => {
          // 错误加载图片是10kb
          options.limit = 12 * 1024
          return options
        })
  }
}