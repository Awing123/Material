import DatePickerVue from "@/components/DatePicker.vue";

export default {
  install(Vue, options = {}) {
    const DatePickerComponent = Vue.extend(DatePickerVue);

    Vue.prototype.$nextTick(() => {
      Vue.prototype.$datePicker = (config = {}) => {
        const instance = new DatePickerComponent({
          vuetify: options.vuetify,
          propsData: {
            ...options,
          },
        })
        instance.$mount()
        document.body.appendChild(instance.$el);

        instance.init(config)
        instance.open();
        return new Promise((resolve, reject) => {
          instance.promise = {
            resolve, reject
          }
        })
      };
    });
  }
}