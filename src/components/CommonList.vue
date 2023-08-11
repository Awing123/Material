<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>下级{{ title }}列表</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              新增
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form">
                <common-register :form="form"></common-register>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> 取消 </v-btn>
              <v-btn color="blue darken-1" text @click="save"> 保存 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">{{
              `确定要删除这个${title}吗？`
            }}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >取消</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >确定</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template #[`item.type`]="{ item }">
      <div v-for="(item1, i) in types" :key="i">
        <div v-if="item1.value == item.type">
          {{ item1.text }}
        </div>
      </div>
    </template>
    <template #[`item.area`]="{ item }">
      <div v-for="(item1, i) in areas" :key="i">
        <div v-if="item1.value == item.area">
          {{ item1.text }}
        </div>
      </div>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize" outlined>
        暂无数据，点击刷新
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
// const commentRules = (field) => [
//   (v) => !!v || `${field}不能为空`,
//   (v) => v.length >= 3 || `${field}长度不能小于 3`,
//   (v) => v.length <= 200 || `${field}长度不能大于 20`,
// ];

import CommonRegister from "@/components/CommonRegister";

export default {
  components: { CommonRegister },
  props: ["form", "title", "desserts", "activeId", "url", "areas", "types"],
  mounted() {
    this.form.forEach((item) => {
      //个别属性不是必填
      // if (
      //   item.rules &&
      //   ["parentId", "type", "area", "phones"].indexOf(item.key) < 0
      // )
      //   item.rules = [...commentRules(item.label), ...item.rules];

      //初始化autocomplete
      let options = {
        headers: {
          Authorization: localStorage.token,
        },
      };
      if (item.type && item.type == "autocomplete") {
        fetch(this.url, options)
          .then((res) => res.json())
          .then((res) => console.log("fetchRes", res));
      }
    });

    this.headers.length = 0;
    this.defaultItem = {};
    this.editedItem = {};
    this.form.forEach((item) => {
      let obj = {};
      obj.text = item.label;
      obj.value = item.key;
      obj.icon = item.icon;
      if (item.rules) obj.rules = item.rules;
      if (item.type) obj.type = item.type;
      this.headers.push(obj);

      this.defaultItem[item.key] = item.key == "enabled" ? true : "";
      this.editedItem[item.key] = item.key == "enabled" ? true : "";
    });
    let obj = { text: "操作", value: "actions", sortable: false };
    this.headers.push(obj);
    console.log("headers", this.headers);
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增" : "修改";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();

      if (val && this.editedIndex === -1) {
        if (this.$refs.form) this.$refs.form.resetValidation();
        //新增-重置输入框的值
        this.form.forEach(
          (item) =>
            (item.model =
              item.type == "switch"
                ? true
                : item.type == "multichips"
                ? []
                : "")
        );
        // 加载父亲节点id
        this.form.forEach((item) => {
          if (item.key == "parentId" && this.activeId != 0)
            item.model = this.activeId;
        });
      }
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    activeId(activeId) {
      console.log("activeId", activeId);
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {},

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.form.forEach((item) => (item.model = this.editedItem[item.key]));
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //   this.desserts.splice(this.editedIndex, 1);
      console.log("editedIndex", this.desserts[this.editedIndex]);
      let options = {
        method: "DELETE",
        headers: {
          Authorization: localStorage.token,
        },
      };
      fetch(this.url + "/" + this.desserts[this.editedIndex].id, options)
        .then((res) => res.json())
        .then((res) => {
          console.log("deleteRes", res);
          alert(`删除${this.title}成功！`);
          this.$emit("reloadData");
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.form.forEach((item) => (this.editedItem[item.key] = item.model));
      console.log("this.editedItem", this.editedItem);
      if (this.editedIndex > -1) {
        // Object.assign(this.desserts[this.editedIndex], this.editedItem);
        let options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: localStorage.token,
          },
          body: JSON.stringify(this.editedItem),
        };
        fetch(this.url + `/${this.editedItem.id}`, options)
          .then((res) => res.json())
          .then((res) => {
            console.log("更改", res);
            alert(`更改${this.title}成功！`);
            this.$emit("reloadData");
          });
      } else {
        // this.desserts.push(this.editedItem);
        // if (this.editedItem.phones)
        //   this.editedItem.phones = this.editedItem.phones.split(",");

        let options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            Authorization: localStorage.token,
          },
          body: JSON.stringify(this.editedItem),
        };
        fetch(this.url, options)
          .then((res) => res.json())
          .then((res) => {
            console.log(`新增${this.title}成功！`, res);
            alert(`新增${this.title}成功！`);
            this.$emit("reloadData");
          });
      }
      this.close();
    },
  },
};
</script>