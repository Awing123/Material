<template>
  <v-text-field
    class="flex-shrink-0 flex-grow-0 ma-2"
    v-model="inValue"
    hide-details
    dense
    outlined
    clearable
    v-bind="$attrs"
    v-on="$listeners"
  ></v-text-field>
</template>

<script>
export default {
  name: "TableTextField",
  model: {
    prop: "modelValue",
    event: "updateModelValue",
  },
  props: {
    modelValue: String,
  },
  computed: {
    inValue: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("updateModelValue", newValue);
        return newValue;
      },
    },
  },
};
</script>

<style></style>
