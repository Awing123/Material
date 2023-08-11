<template>
  <div class="text-center">
    <v-overlay :value="overlay" :absolute="absolute">
      <v-card color="primary" dark width="300">
        <v-card-text>
          {{ tip }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-overlay>
  </div>
</template>
<script>
export default {
  props: {
    tip: {
      type: String,
      default: "加载中...",
    },
    timeout: {
      type: Number,
      default: 6,
    },
    absolute: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      overlay: true,
      dialog: false,
      timer: null,
    };
  },
  watch: {
    dialog(val) {
      if (!val) return;
      // 超时关闭
      if (this.timeout > 0) {
        this.timer = setTimeout(() => this.close(), this.timeout * 1000);
      }
    },
  },
  methods: {
    show() {
      this.dialog = true;
      this.overlay = true;
    },
    close() {
      this.dialog = false;
      this.overlay = false;
      clearTimeout(this.timer);
      // 等待overlay销毁后再销毁自身
      this.$nextTick(() => {
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
      });
    },
  },
};
</script>
