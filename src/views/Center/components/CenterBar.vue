<template>
  <v-toolbar >
    <v-app-bar-nav-icon @click="$emit('toggle')"></v-app-bar-nav-icon>
    <v-toolbar-title>应用中心</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      mini: false,
      text: "",
    };
  },
};
</script>

<style></style>
