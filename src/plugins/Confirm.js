import ConfirmDefault from '@/components/Confirm/ConfirmDefault'

export default {
  install(Vue, options = {}) {
    ConfirmDefault.vuetify = options.vuetify

    Vue.prototype.$confirm = config => {
      const vm = new Vue(ConfirmDefault);
      Object.assign(vm, config);
      vm.$mount();
      document.body.appendChild(vm.$el);
      return new Promise((resolve, reject) => {
        vm.promise = {
          resolve, reject
        }
      })
    }
  }
}