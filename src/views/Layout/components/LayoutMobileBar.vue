<template>
  <v-app-bar app color="#3880ff" dark dense>
    <!-- 后退按钮 -->
    <v-btn icon @click="goBack" v-if="!$route.meta.hideBack">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <slot name="left"></slot>

    <v-spacer></v-spacer>

    <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>

    <v-spacer></v-spacer>

    <slot name="right"></slot>

    <v-btn icon @click="closeBrowser">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { closeBrowser } from "@/utils/desktop";
export default {
  props: {
    menus: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goBack() {
      window.top.history.back();
    },
    closeBrowser,
  },
};
</script>

<style></style>
