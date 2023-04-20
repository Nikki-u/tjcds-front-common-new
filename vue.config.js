const merge = require('webpack-merge')
module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  devServer: {
    // port: 9090,
    proxy: {
      // '/map/3D': {
      //   target: 'http://218.67.246.252:83/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //       '^/map/3D': ''
      //   }
      // }
      '/map': {
        target: 'http://218.67.246.252:83',
        changeOrigin: true,
        pathRewrite: {
          '^/map': ''
        }
      }
    }
  },
  css: { extract: false },
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add('/packages/')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
    // config.resolve.symlinks(true)
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        return merge(options, {
          limit: 512000 // 500 kb
        })
      })
  }
}
