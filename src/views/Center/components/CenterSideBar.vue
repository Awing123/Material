<template>
  <v-list color="grey lighten-4" min-width="200">
    <v-list-item
      v-for="(item, index) in menus"
      :key="index"
      @click="handleToggle(item)"
    >
      <v-list-item-title v-text="item" class="text-center"></v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: "CenterSideBar",
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mini: false,
    };
  },
  methods: {
    handleToggle(data) {
      this.$emit("toggle", data);
    },
  },
};
</script>

<style></style>
