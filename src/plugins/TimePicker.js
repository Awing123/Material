import TimePickerVue from "@/components/TimePicker.vue";

export default {
  install(Vue, options = {}) {
    const TimePickerComponent = Vue.extend(TimePickerVue);

    Vue.prototype.$nextTick(() => {
      Vue.prototype.$timePicker = (config = {}) => {
        const instance = new TimePickerComponent({
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