const {
  defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
  assetsDir: 'static',
  publicPath: process.env.NODE_ENV === 'development' ? './' : './',
  outputDir: 'dist',
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify',
    "@koumoul/vjsf"
  ],
  devServer: {
    proxy: {
      '/meetingManager': {
        target: 'https://myoa.mmzqoa.net',
        // target: 'https://imyoa.mmzqoa.net:30443',
        xfwd: true
      },
      '/organization': {
        target: 'https://auth.mmzqoa.net',
        // target: 'https://imyoa.mmzqoa.net:30443',
        xfwd: true
      }
    }
  },
  parallel: require('os').cpus().length > 1,
  lintOnSave: false, // 关闭eslint校验
})
