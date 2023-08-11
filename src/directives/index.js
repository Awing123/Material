import resize from "./resize";

export default {
  install(Vue) {
    Vue.directive('dom-resize', resize)
  }
}