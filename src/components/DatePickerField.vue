<template>
  <div @click="handleDatePicker">
    <v-text-field
      append-icon="mdi-calendar"
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
    handleDatePicker() {
      if (this.readonly) return;
      this.$datePicker({ date: this.value, type: this.$attrs.type }).then(
        (data) => {
          this.$emit("change", data);
        }
      );
    },
  },
};
</script>
