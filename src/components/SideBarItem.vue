<template>
  <v-list-group
    v-if="data.children"
    :value="data.active"
    :prepend-icon="data.icon"
    no-action
    :sub-group="sub"
    @click="onGroupClick(data)"
  >
    <template v-slot:activator>
      <v-list-item-title>
        <div>{{ data.title }}</div>
      </v-list-item-title>
    </template>

    <side-bar-item
      v-for="(item, index) in data.children"
      :data="item"
      :sub="true"
      :key="index"
    ></side-bar-item>
  </v-list-group>

  <v-list-item
    v-else
    v-show="!data.hide"
    link
    :to="data.iframe ? `${iframeRoute}/${data.id}` : data.path"
  >
    <v-list-item-icon v-if="data.icon">
      <v-icon v-text="data.icon"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="data.title"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: "SideBarItem",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    sub: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: null,
      iframeRoute: "/apps",
    };
  },
  methods: {
    onGroupClick(data) {
      this.$emit("toggle", data);
    },
    handleClick(item) {
      if (!item.path) return;
      if (item.iframe) {
        this.$router.push({
          name: "AppIframe",
          params: {
            name: item.id,
          },
        });
      } else {
        this.$router.push(item.path);
      }
    },
  },
};
</script>

<style></style>
