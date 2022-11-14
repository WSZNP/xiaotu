const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 哪些文件自动引入,使用绝对路径
      patterns: [path.join(__dirname, './src/assets/styles/variables.less'), path.join(__dirname, './src/assets/styles/mixins.less')]
    }
  },
  // 这个是给webpack-dev-server开启可IP和域名访问权限。
  configureWebpack: {
    devServer: {
      // disableHostCheck: true
      allowedHosts: ['www.corho.com'] // www.corho.com=>扫码授权后的回调地址
    },
    externals: {
      qc: 'QC'
    }
  }
})
