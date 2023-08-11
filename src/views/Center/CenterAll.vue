<template>
  <v-sheet>
    <!-- 应用列表 -->
    <v-sheet
      :id="item.title"
      v-for="(item, index) in list"
      :key="index"
      color="white"
      rounded
      elevation="0"
      class="ma-4"
    >
      <v-subheader
        ><b>{{ item.title }}</b></v-subheader
      >
      <CenterApp :data="item.apps" />
    </v-sheet>
  </v-sheet>
</template>

<script>
import CenterApp from "./components/CenterApp.vue";
export default {
  components: {
    CenterApp,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style></style>
