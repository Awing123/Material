<template>
  <div @click="handleTimePicker">
    <v-text-field
      append-icon="mdi-clock"
      readonly
      v-bind="$attrs"
      v-bind:value="value"
      @click:clear="$emit('change', '')"
    ></v-text-field>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleTimePicker() {
      if (this.readonly) return;
      this.$timePicker({ time: this.value }).then((data) => {
        this.$emit("change", data);
      });
    },
  },
};
</script>
