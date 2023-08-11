<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          {{ title }}
        </v-card-title>
        <v-card-text class="text-h6">{{ content }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="onCancel">
            {{ cancelLabel }}
          </v-btn>
          <v-btn color="primary darken-1" text @click="onConfirm">
            {{ confirmLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      dialog: true,
    };
  },
  props: {
    title: {
      type: String,
      default: "提示",
    },
    content: {
      type: String,
      default: "",
    },
    cancelLabel: {
      type: String,
      default: "取消",
    },
    confirmLabel: {
      type: String,
      default: "确定",
    },
  },
  methods: {
    onConfirm() {
      this.promise.resolve();
      this.onClose();
    },
    onCancel() {
      this.promise.reject();
      this.onClose();
    },
    onClose() {
      this.dialog = false;
      this.$nextTick(() => {
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
      });
    },
  },
};
</script>
