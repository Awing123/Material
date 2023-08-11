<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col>
          <v-treeview
            ref="treeview"
            v-model="selection"
            :items="items"
            :selection-type="selectionType"
            selectable
            phone
            onlyLeaf
            return-object
            v-bind="$attrs"
            @input="handleUpdate"
          >
            <template v-slot:label="{ item }">
              {{ item.children ? item.name : `${item.name}(${item.phone})` }}
            </template>
          </v-treeview>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col class="pa-6" cols="6">
          <template v-if="!customSelection.length"> 没有选中 </template>
          <template v-else>
            <div v-for="node in customSelection" :key="node.id">
              <v-chip
                class="ma-2"
                close
                :color="node.children ? 'indigo darken-3' : 'green darken-2'"
                outlined
                @click:close="onDelete(node)"
              >
                <v-icon left>
                  {{
                    node.children ? "mdi-account-group" : "mdi-account"
                  }} </v-icon
                >{{ node.name }}
                {{ node.children || !phone ? "" : `(${node.phone})` }}
              </v-chip>
            </div>
          </template>
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="cancel">取消 </v-btn>
      <v-btn class="ml-4" color="error" @click="clearAll">重置 </v-btn>
      <v-btn class="ml-4" color="primary" @click="getSelection">确定</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
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
  data: () => ({
    selectionType: "leaf",
    selection: [],
    customSelection: [],
  }),
  created() {
    console.log(this.$attrs);
  },
  methods: {
    handleUpdate() {
      const { nodes } = this.$refs.treeview;

      let selectedList = Object.values(nodes).filter((i) => i.isSelected);

      const result = selectedList.reduce((target, current) => {
        // 如果限定只需要人员数据，排除部门单位
        if (this.onlyLeaf) {
          !current.item.children && (target[current.item.id] = current.item);
        } else {
          if (!current.parent || !nodes[current.parent].isSelected)
            target[current.item.id] = current.item;
        }

        return target;
      }, {});

      this.customSelection = Object.values(result);
    },
    onDelete(node) {
      this.$refs.treeview.updateSelected(node.id, false);
      this.handleUpdate();
    },
    clearAll() {
      this.selection = [];
      this.customSelection = [];
    },
    getSelection() {
      this.$emit("update", this.customSelection);
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
