<template>
  <v-card flat tile height="100%" style="overflow: hidden">
    <iframe
      ref="iframeWindow"
      v-if="url"
      :src="url"
      frameborder="0"
      scrolling="auto"
      class="frame"
    ></iframe>
  </v-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},

  computed: {
    url() {
      return this.$route.query.url;
    },
  },
};
</script>

<style lang="scss" scope>
.frame {
  width: 100%;
  height: 100%;
}
</style>
