<template>
  <div>
    <div v-for="(item, i) in form" :key="i">
      <v-text-field
        v-if="!item.type || item.type == 'text'"
        v-model="item.model"
        :prepend-icon="item.icon"
        :label="item.label"
        required
        :rules="item.rules"
        :readonly="item.readonly"
        :disabled="item.disabled"
      ></v-text-field>
      <v-switch
        v-else-if="item.type == 'switch'"
        v-model="item.model"
        :prepend-icon="item.icon"
        :label="item.label"
        required
        :rules="item.rules"
      ></v-switch>
      <v-autocomplete
        v-else-if="item.type == 'autocomplete'"
        v-model="item.model"
        :prepend-icon="item.icon"
        :label="item.label"
        required
        :rules="item.rules"
        :items="item.items"
      >
      </v-autocomplete>
      <multi-chips
        v-else-if="item.type == 'multichips'"
        v-model="item.model"
        :prepend-icon="item.icon"
        :label="item.label"
        required
        @remove="remove"
      >
      </multi-chips>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonRegister",
  props: ["form"],
  components: {
    MultiChips: () => import("@/components/MultiChips"),
  },
  data: () => ({
    dialog: false,
    dialogTitle: "",
    dialogContent: "",
    loading: false,
  }),
  methods: {
    remove({ chips, item }) {
      console.log("chips", chips);
      console.log("item", item);
      chips.splice(chips.indexOf(item), 1);
    },
    handleSubmit() {
      const valid = this.$refs.form.validate();
      if (valid) {
        this.loading = true;
        // this.$store.dispatch("user/register", this.form).then(() => {
        //   this.loading = false;
        //   this.$router.push("/login");
        // });
        this.showDialog("注册成功", "您已成功注册");
        this.loading = false;
        let submitData = {};
        this.form.forEach((item) => (submitData[item.key] = item.model));
        console.log("submitData", submitData);
      }
    },
    showDialog(title, content) {
      this.dialogTitle = title;
      this.dialogContent = content;
      this.dialog = true;
    },
  },
};
</script>

<style scoped></style>