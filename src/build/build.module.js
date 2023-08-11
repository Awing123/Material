// 部署模块化，非多页面打包模式，每次只会打包其中一个模块
const modules = [
  {
    name: 'OA',
    entry: 'src/main.js',
    title: 'MYOA',
  },
  {
    name: 'user',
    entry: 'src/build/User/entry.js',
    title: '用户管理'
  }
]
// const target = {
//   myoa: 'https://imyoa.mmzqoa.net:30443',
//   auth: 'https://iauth.mmzqoa.net:30443'
// }
const target = {
  myoa: 'https://myoa.mmzqoa.net',
  auth: 'https://auth.mmzqoa.net'
}

const proxy = {
  '/auth': {
    target: target.auth,
    changeOrigin: true,
    xfwd: true
  },
  '/engine': {
    target: target.myoa,
    changeOrigin: true,
    xfwd: true
  },
  '/organization': {
    target: target.auth,
    changeOrigin: true,
    xfwd: true
  },
  '/docexechange': {
    target: target.myoa,
    changeOrigin: true,
  },
  '/hr': {
    target: target.myoa,
    changeOrigin: true,
  },
  '/sms': {
    target: target.myoa,
    changeOrigin: true,
  },
  '/mmydcounter': {
    target: target.myoa,
    changeOrigin: true,
  },
}


const modulesConfig = modules.reduce((target, module) => {
  target[module.name] = {
    pages: {
      index: {
        entry: module.entry,
        title: module.title,
        template: 'public/index.html',
      }
    },
    devServer: {
      proxy,
      allowedHosts: 'test.local'
    }
  }
  return target
}, {})

console.log(modulesConfig)



module.exports = modulesConfig
