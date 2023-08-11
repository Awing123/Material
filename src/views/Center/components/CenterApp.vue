<template>
  <div>
    <v-item-group class="d-flex flex-wrap">
      <v-item
        v-for="(app, index) in data"
        :key="index"
        class="mt-2 mb-2 ml-2 flex-shrink-0 pointer app-item"
      >
        <v-card
          class="d-flex align-center flex-column justify-space-around align-center app-wrapper"
          :width="width"
          :height="height"
          @click="goApp(app)"
        >
          <v-icon size="40" :color="app.resourceColor">{{ app.icon }}</v-icon>

          <div class="text-truncate">
            {{ app.name }}
          </div>
        </v-card>
      </v-item>
    </v-item-group>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    width: {
      type: Number,
      default: 80,
    },
    height: {
      type: Number,
      default: 80,
    },
  },
  methods: {
    goApp(item) {
      this.$router.push(
        item.iframe
          ? {
              name: "AppFrame",
              query: {
                url: item.path,
              },
            }
          : { path: item.path }
      );
      // window.location.href = item.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  box-sizing: border-box;
}

.app-item:last-of-type {
  margin-right: 8px;
}
</style>
