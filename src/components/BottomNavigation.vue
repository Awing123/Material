<template>
  <v-bottom-navigation app color="primary" grow :value="activeIndex">
    <v-btn v-for="(item, index) in items" :key="index" @click="onChange(item)">
      <span>{{ item.title }}</span>

      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onChange(item) {
      this.$emit("change", item);
    },
  },
};
</script>

<style></style>
