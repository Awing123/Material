import LoadingProcess from "@/components/LoadingProcess.vue";

export default {
  install(Vue, options = {}) {
    LoadingProcess.vuetify = options.vuetify

    Vue.prototype.$loading = function (loadingConfig) {
      // 创建组件
      const vm = new Vue(LoadingProcess);
      // 应用配置
      Object.assign(vm, loadingConfig);
      // 挂载组件
      vm.$mount();
      // 挂载到dom
      this.$nextTick(() => {
        this.$el.appendChild(vm.$el);
        // 调用显示
        vm.show();
      })

      // 返回实例
      return vm;
    }
  }

}
