<template>
  <div class="d-flex align-center">
    <v-dialog v-model="dialog" persistent>
      <template #activator="{ on }">
        <v-btn color="primary" v-on="on">{{ label }}</v-btn>
      </template>

      <TreeSelect
        ref="treeSelect"
        :items="items"
        phone
        onlyLeaf
        open-on-click
        :load-children="fetchChildren"
        v-bind="$attrs"
        @update="handleUpdate"
        @cancel="handleCancel"
      >
        <template v-slot:label="{ item }">
          {{ item.children ? item.name : item.name + item.phone }}
        </template>
      </TreeSelect>
    </v-dialog>

    <v-sheet class="d-flex">
      <div v-for="node in selections" :key="node.id">
        <v-chip
          small
          class="ma-2"
          :color="node.children ? 'indigo darken-3' : 'green darken-2'"
          outlined
        >
          <v-icon left>
            {{ node.children ? "mdi-account-group" : "mdi-account" }}
          </v-icon>
          {{ node.name }}{{ node.children || !phone ? "" : `(${node.phone})` }}
        </v-chip>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import TreeSelect from "@/components/TreeSelect.vue";
import {
  getDepartments,
  getEmployeesByDepartmentId,
  getDepartmentsByParentId,
} from "@/apis/user";
export default {
  components: { TreeSelect },
  props: {
    label: {
      type: String,
      default: "选择人员",
    },
    phone: {
      type: Boolean,
      default: false,
    },
    onlyLeaf: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: false,
      items: [],
      selections: [],
    };
  },
  created() {
    this.$nextTick(() => this.fetchData());
  },
  watch: {
    dialog(value) {
      if (value && !this.items.length) {
        this.fetchData();
      }
    },
  },
  methods: {
    handleUpdate(data) {
      this.dialog = false;
      this.selections = data;
      this.$emit("update", data);
    },
    handleCancel() {
      this.dialog = false;
    },
    fetchData() {
      getDepartments().then(({ data }) => {
        this.items = data.content.map((i) => ({
          ...i,
          children: [],
        }));
      });
    },
    async fetchChildren(item) {
      const id = item.id;
      const [employeesRes, departmentsRes] = await Promise.all([
        getEmployeesByDepartmentId(id),
        getDepartmentsByParentId(id),
      ]);

      const employees = employeesRes.data.content;
      const departments = departmentsRes.data.content.map((i) => ({
        ...i,
        children: [],
      }));
      item.children = [...employees, ...departments];
    },
    getValues() {
      return this.selections;
    },
    clear() {
      this.selections = [];
      this.$refs.treeSelect.clearAll();
    },
  },
};
</script>

<style></style>
