<template>
  <v-dialog v-model="dialog" persistent>
    <template #activator="{ on }">
      <v-textarea
        :label="label"
        :disabled="disabled"
        :rules="rules"
        :required="required"
        :name="fullKey"
        :value="value"
        readonly
        clearable
        auto-grow
        rows="1"
        v-on="on"
        v-bind="$attrs"
        @click:clear="selected = []"
      >
      </v-textarea>
    </template>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-icon>mdi-account-multiple-plus</v-icon>
        <v-toolbar-title>人员选择</v-toolbar-title>
      </v-toolbar>
      <v-row>
        <v-col>
          <v-card-text>
            <v-treeview
              v-model="selected"
              :load-children="fetch"
              :items="items"
              return-object
              selectable
              expand-icon="mdi-chevron-down"
              @input="input"
            >
            </v-treeview>
          </v-card-text>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="12" md="6">
          <v-card-text>
            <div
              v-if="selected.length === 0"
              key="title"
              class="text-h6 font-weight-light grey--text pa-4 text-center"
            >
              请选择人员
            </div>
            <v-scroll-x-transition group hide-on-leave>
              <v-chip
                v-for="(selection, i) in selected.filter(
                  (item) => !item.children
                )"
                :key="i"
                close
                class="ma-1"
                @click:close="selected.splice(i, 1)"
              >
                {{ selection.name }}
              </v-chip>
            </v-scroll-x-transition>
          </v-card-text>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text @click="selected = []"> 清空选择 </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          class="white--text"
          color="green darken-1"
          depressed
          @click="dialog = false"
        >
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { token } from "@/mock/auth";
export default {
  props: {
    value: { type: String, default: "" },
    options: { type: Object, required: false, default: () => ({}) },
    schema: { type: Object, required: false },
    fullSchema: { type: Object, required: false, default: () => ({}) },
    fullKey: { type: String, required: false, default: "" },
    label: { type: String, default: "" },
    htmlDescription: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    rules: { type: Array, required: false, default: () => [] },
    on: { type: Object, required: false, default: () => ({}) },
  },
  data: () => ({
    selected: [],
    dialog: false,
    items: [],
  }),
  watch: {
    selected(newValue) {
      console.log("newValue", newValue);
      this.on.input(newValue.filter((item) => !item.children));
    },
  },
  mounted() {
    let options = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    let url = "organization/org-user/v1/departments";
    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        console.log("organization", res);
        this.items = res.data.content.map((item) => ({
          id: item.id,
          name: item.name,
          children: [],
        }));
      });
  },

  methods: {
    input(items) {
      console.log("input", items);
      items.forEach((item) => {
        let children = this.fetch(item);
        if (children.length > 0) this.input(children);
      });
    },
    async fetch(item) {
      let options = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      //加载用户
      let url = "organization/org-user/v1/employees?departmentId=" + item.id;
      let data = await fetch(url, options);
      let json = await data.json();
      console.log("users", json);
      let items = json.data.content.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      if (items.length > 0) item.children.push(...items);

      //加载部门
      url = "organization/org-user/v1/departments?parentId=" + item.id;
      data = await fetch(url, options);
      json = await data.json();
      console.log("dept", json);
      items = json.data.content.map((item) => ({
        id: item.id,
        name: item.name,
        children: [],
      }));
      if (items.length > 0) item.children.push(...items);

      return item.children;
    },
  },
};
</script>
