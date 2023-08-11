import Vue from 'vue'
import App from '@/views/AppView.vue'
import router from '@/router/user'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
