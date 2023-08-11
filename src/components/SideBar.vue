<template>
  <v-navigation-drawer
    color="blue lighten-5"
    :mini-variant="mini"
    v-model="drawer"
    :app="app"
    clipped
  >
    <v-list class="pt-0">
      <side-bar-item
        v-for="(item, index) in menus"
        :key="index"
        :data="item"
        @toggle="handleToggle"
      ></side-bar-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import SideBarItem from "@/components/SideBarItem";
export default {
  name: "SideBar",
  components: {
    SideBarItem,
  },
  props: {
    mini: {
      type: Boolean,
      default: false,
    },
    menus: {
      type: Array,
      default: () => [],
    },
    app: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      drawer: null,
    };
  },
  watch: {
    "$vuetify.breakpoint.mobile"(val) {
      if (!val) this.drawer = true;
    },
  },
  methods: {
    handleToggle(data) {
      this.$emit("toggle", data);
    },
    toggle() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style></style>
