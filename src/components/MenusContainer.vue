<template>
  <v-app>
    <LayoutBar v-if="showBar && !isMobile" />

    <LayoutMobileBar
      v-if="isMobile && !isFlutter"
      :menu="showMenu"
      @toggleMenu="onToggleMenu"
    />

    <v-card
      flat
      tile
      class="d-flex"
      :class="{ 'container-wrapper': showBar && !isMobile }"
      min-height="100vh"
    >
      <SideBar
        v-if="showMenu"
        ref="sidebar"
        class="flex-shrink-0"
        :menus="menus"
        :app="app"
      />

      <v-main>
        <v-container fluid class="flex-grow-1 overflow-y-auto pa-0">
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import LayoutBar from "@/views/Layout/components/LayoutBar";
import LayoutMobileBar from "@/views/Layout/components/LayoutMobileBar";
import SideBar from "@/components/SideBar.vue";
import {isFlutter} from "@/utils/desktop";

export default {
  components: {
    LayoutBar,
    LayoutMobileBar,
    SideBar,
  },
  props: {
    showBar: {
      type: Boolean,
      default: false,
    },
    showMenu: {
      type: Boolean,
      default: true,
    },
    menus: {
      type: Array,
      default() {
        // 格式
        // [{
        //   title: "string", // 一级目录标题
        //   active: true, // 是否默认展开
        //   children: [
        //     {
        //       title: "string",
        //       path: "string",
        //     },
        //   ],
        // }]
        return [];
      },
    },
    app: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile;
    },
    isFlutter() {
      return isFlutter()
    }
  },
  methods: {
    onToggleMenu() {
      this.$refs.sidebar.toggle();
    },
  },
};
</script>
<style lang="scss">
.container-wrapper {
  box-sizing: border-box;
  padding-top: 64px;
}
</style>
