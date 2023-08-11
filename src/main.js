import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import components from './plugins/components'
import directives from './directives'
import motify from 'motify'
import 'motify/motify.css'
import './style/common.scss'
// import VConsole from 'vconsole'

// import DatetimePicker from 'vuetify-datetime-picker'
// import 'vuetify-datetime-picker/src/stylus/main.styl'
//
// Vue.use(DatetimePicker)

import VueLoadmore from 'vuejs-loadmore';
Vue.use(VueLoadmore);
// Vue.use(new VConsole())
Vue.config.productionTip = false
Vue.use(motify)
Vue.use(components, { vuetify })
Vue.use(directives)

window.$router = router

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
