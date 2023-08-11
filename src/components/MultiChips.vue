<template>
  <v-combobox
    chips
    clearable
    :label="label"
    multiple
    :value="chips"
    @input="updateVal($event)"
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        close
        @click="select"
        @click:close="remove(item)"
      >
        {{ item }}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
export default {
  model: {
    prop: "chips",
    event: "change",
  },

  props: ["label", "chips"],

  methods: {
    remove(item) {
      // this.chips.splice(this.chips.indexOf(item), 1);
      this.$emit("remove", { chips: this.chips, item: item });
    },
    updateVal(val) {
      console.log("updateVal", val);
      console.log("this.chips", this.chips);
      this.$emit("change", val);
    },
  },
};
</script>