<template>
  <div
    class="window-control-wrapper"
    v-dom-resize="handleResize"
    :style="{ height, maxHeight }"
  >
    <v-card v-if="show">
      <!-- 标题栏 -->
      <v-card-title class="blue lighten-5 pa-2">
        <v-icon>mdi-apps</v-icon>
        <span>{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" v-if="showRefresh" text @click="onRefresh">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>

        <slot name="actions"></slot>
      </v-card-title>

      <!-- 内容 -->
      <div
        class="window-content"
        :style="{ height: contentHeight ? contentHeight : autoContentHeight }"
      >
        <slot></slot>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "WindowControl",
  props: {
    title: {
      type: String,
      default: "WindowControl",
    },
    height: {
      type: String,
    },
    maxHeight: {
      type: String,
    },
    contentHeight: {
      type: String,
    },
    contentMaxHeight: {
      type: String,
    },
    showMore: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      default: "",
    },
    autoHeight: {
      type: Boolean,
      default: false,
    },
    showRefresh: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: true,
      autoContentHeight: "auto",
      overlay: false,
    };
  },
  // async mounted() {
  //   await this.$nextTick();
  //   if (this.autoHeight) {
  //     this.autoContentHeight = this.$el.clientHeight - 52 + "px";
  //   }
  // },
  methods: {
    async onRefresh() {
      console.log("refresh");
      this.show = false;
      const loading = this.$loading({ absolute: true });
      await this.$nextTick();
      this.show = true;
      setTimeout(loading.close, 1000);
    },
    handleResize(data = {}) {
      let height = data.height;
      if (height.includes("px")) {
        height = parseFloat(height) - 52 + "px";
      }
      if (this.autoHeight) {
        this.autoContentHeight = height;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.window-control-wrapper {
  position: relative;
}
.window-content {
  overflow: auto;
}
</style>
