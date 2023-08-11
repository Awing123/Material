<template>
  <div class="d-flex align-center">
    <v-dialog v-model="dialog" persistent>
      <template #activator="{ on }">
        <v-btn color="primary" v-on="on">选择处理人员</v-btn>
      </template>

      <TreeSelect
        ref="treeSelect"
        :items="items"
        open-on-click
        :load-children="fetchChildren"
        v-bind="$attrs"
        @update="handleUpdate"
        @cancel="handleCancel"
      />
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
          {{ node.name }}
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
    clear() {
      this.selections = [];
      this.$refs.treeSelect.clearAll();
    },
  },
};
</script>

<style></style>
