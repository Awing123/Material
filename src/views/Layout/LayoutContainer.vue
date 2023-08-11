<template>
  <!-- App.vue -->

  <v-app>
    <side-bar :mini="mini" v-if="!isMobile && showSideBar" />

    <LayoutBar v-if="!isMobile && !isIFrame" />

    <!-- 根据应用组件来调整你的内容 -->
    <v-main style="height: 100%">
      <!-- <v-alert type="success" :value="alert">{{ alertText }}</v-alert> -->
      <!-- 如果使用 vue-router -->
      <router-view :key="key"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from "@/components/SideBar";
import LayoutBar from "./components/LayoutBar.vue";
import systemConfig from "@/configs/system";
export default {
  name: "LayoutView",
  components: {
    SideBar,
    LayoutBar,
  },
  computed: {
    key() {
      return this.$route.path;
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile;
    },
    isIFrame() {
      return window.top.parent !== window;
    },
  },
  data: () => ({
    showSideBar: false,
    mini: false,
    systemConfig,
    alert: false,
    alertText: "",
  }),
  methods: {},
  async created() {
    await this.$store.dispatch("getUserInfo");
    await this.$store.dispatch("getRoles");
  },
  mounted() {
    let _this = this;
    _this.alert = false;
    var timeOut;

    window.alert = function (alertText) {
      _this.alert = true;
      _this.alertText = alertText;
      if (timeOut) clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        _this.alert = false;
      }, 5000);
    };
  },
};
</script>
