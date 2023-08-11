<template>
  <div class="wrapper">
    <v-btn color="primary" v-bind="$attrs">
      {{ label }}
    </v-btn>
    <v-file-input class="hide-input pa-0" :ref="refId" @change="onChange" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      refId: "file-button-" + new Date().getTime(),
    };
  },
  props: {
    label: {
      type: String,
      default: "",
    },
  },
  methods: {
    onChange(file) {
      this.$emit("change", file);
    },
  },
};
</script>

<style lang="scss" scope>
.wrapper {
  position: relative;
  overflow: hidden;
}

.hide-input {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  z-index: 1;
}
</style>
