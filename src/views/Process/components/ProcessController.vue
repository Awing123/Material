<template>
  <div>
    <v-sheet>
      <h1 class="text-center mb-10">{{ task.name }}</h1>

      <template>
        <v-card outlined class="ma-2" v-for="item in workflow" :key="item.id">
          <v-card-title>下一步流程：{{ item.name }}</v-card-title>
          <v-container fluid v-if="!item.end && showSelect">
            <v-form>
              <p class="subtitle-1">选择处理人员/部门</p>
              <ProcessUserSelect
                ref="processUserSelect"
                @update="(data) => handleSelect(item)(data)"
              />

              <!-- <v-divider class="mt-10 mb-10"></v-divider> -->
            </v-form>
          </v-container>
        </v-card>
      </template>

      <v-card class="ma-2" outlined>
        <v-container fluid>
          <p class="subtitle-1">审批意见</p>
          <v-textarea
            outlined
            v-model="suggestion"
            label="请填写审批意见"
            rows="3"
          ></v-textarea>
        </v-container>
      </v-card>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="onClear">清空</v-btn>
        <v-btn color="primary" @click="onSubmit">提交</v-btn>
      </v-card-actions>
    </v-sheet>
  </div>
</template>

<script>
import ProcessUserSelect from "@/views/Process/components/ProcessUserSelect";
import { continueToComplete } from "@/apis/task";
import { getTaskById } from "@/apis/task";
import postMessageMixin from "@/mixins/postMessageMixin";

export default {
  mixins: [postMessageMixin],
  components: {
    ProcessUserSelect,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      workflow: [],
      details: {},
      suggestion: "",
    };
  },
  computed: {
    task() {
      return this.details.task || {};
    },
    nextNodes() {
      return this.details.nextNodes || [];
    },
    isEnd() {
      return this.nextNodes.some((i) => i.end);
    },
    showSelect() {
      return this.nextNodes.some((i) => i.assignee || i.candidateUsers.length);
    },
  },
  watch: {
    id(val) {
      if (val) this.getTaskDetail(val);
    },
  },
  mounted() {
    if (window.top.desktop && this.id) {
      this.getTaskDetail(this.id);
    }
  },
  methods: {
    messageCallback() {
      if (this.id) this.getTaskDetail(this.id);
    },
    // 获取业务流程详情
    getTaskDetail(id) {
      return getTaskById(id).then(({ error, data }) => {
        if (error) return;
        this.details = data;
        this.workflow = data.nextNodes.map((i) => {
          return {
            ...i,
            nextUsers: [],
            nextUsersValue: "",
          };
        });
      });
    },
    // 获取
    handleSelect(workflow) {
      return (selected) => {
        workflow.nextUsers = selected;
        workflow.nextUsersValue = selected
          .map((item) => `${item.name}(${item.id})`)
          .join(",");
      };
    },
    onSubmit() {
      // if (
      //   !this.isEnd &&
      //   (!this.workflow.length || !this.workflow[0].nextUsers.length)
      // ) {
      //   this.$message.info("请选择处理人员");
      //   return;
      // }

      let transientVariables = {};

      if (!this.isEnd) {
        for (let i of this.workflow) {
          let { assignee, nextUsers } = i;
          if (nextUsers.length) {
            nextUsers.forEach((item) => {
              let key = assignee.slice(2, -1);
              transientVariables[key] = item.id;
            });
          }
        }
      }

      continueToComplete(this.id, {
        suggestion: this.suggestion,
        transientVariables,
      }).then(({ error }) => {
        if (!error) {
          this.$message.success("提交成功");
          this.$emit("success");
        }
        this.onClear();
      });
    },
    onClear() {
      const refs = this.$refs.processUserSelect;
      if (refs && refs.length) {
        refs[0].clear();
      }
    },
  },
};
</script>

<style></style>
