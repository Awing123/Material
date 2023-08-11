import DatePickerField from "@/components/DatePickerField.vue";
import TimePickerField from "@/components/TimePickerField.vue";
import TableTextField from "@/components/TableTextField.vue";
import CommonTable from "@/components/CommonTable.vue";
import PullUpComponent from "@/components/PullUpComponent.vue";

import DatePickerPlugin from './DatePicker'
import TimePickerPlugin from './TimePicker'
import LoadingPlugin from './Loading'
import ConfirmPlugin from './Confirm'

export default {
  install(Vue, options = {}) {
    const vuetify = options.vuetify || {}
    Vue.component("DatePickerField", DatePickerField);
    Vue.component("TimePickerField", TimePickerField);
    Vue.component("CommonTable", CommonTable);
    Vue.component("TableTextField", TableTextField);
    Vue.component("PullUpComponent", PullUpComponent)

    Vue.use(DatePickerPlugin, { vuetify });
    Vue.use(TimePickerPlugin, { vuetify });
    Vue.use(LoadingPlugin, { vuetify });
    Vue.use(ConfirmPlugin, { vuetify })
  }
};