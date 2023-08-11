<template>
  <div>
    <v-dialog
      :ref="'dialog' + new Date().getTime()"
      v-model="dialog"
      width="auto"
      @click:outside="handleClickOutside"
    >
      <v-card>
        <v-date-picker v-model="picker" :type="type"></v-date-picker>
        <v-card-actions>
          <v-btn color="primary" text @click="handleClose">关闭</v-btn>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="handleSubmit">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { formatDate } from "@/utils/datetime";
export default {
  props: {
    date: {
      type: String,
      default: "",
    },
    onSubmit: {
      type: Function,
      default: () => {},
    },
    onCancel: {
      type: Function,
      default: () => {},
    },
    onOutside: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
      picker: null,
      type: "date",
    };
  },
  methods: {
    init(params) {
      this.picker = params.date || formatDate(new Date(), "yyyy-MM-dd");
      this.type = params.type || "date";
      const keys = ["onSubmit", "onCancel", "onOutside"];
      for (let key of keys) {
        if (params[key]) {
          this[key] = params[key];
        }
      }
    },
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
    handleClickOutside() {
      this.onOutside();
      this.close();
    },
    handleClose() {
      this.onCancel();
      this.close();
    },
    handleSubmit() {
      this.promise.resolve(this.picker);
      this.onSubmit(this.picker);
      this.close();
    },
  },
};
</script>

<style></style>
