<template>
  <v-card class="mx-auto">
    <v-subheader>流程处理：</v-subheader>
    <v-list v-if="0" three-line>
      <div v-for="(item, index) in items" :key="index">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle
              >处理人：{{ employees[item.assignee] }}</v-list-item-subtitle
            >
            <v-list-item-subtitle
              >处理意见：{{
                item.taskLocalVariables._suggestion
              }}</v-list-item-subtitle
            >
            <v-list-item-subtitle
              >处理时间：{{
                formatDate(item.time, "yyyy-MM-dd hh:mm")
              }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="index !== items.length - 1"></v-divider>
      </div>
    </v-list>

    <v-timeline dense>
      <v-timeline-item small v-for="(item, index) in items" :key="index">
        <v-card class="mr-2 elevation-2">
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>
            <span class="mr-5">{{ employees[item.assignee] }}</span>
            <span>{{
              formatDate(item.time, "yyyy-MM-dd hh:mm")
            }}</span></v-card-subtitle
          >
          <v-card-text>
            意见：{{ item.taskLocalVariables._suggestion }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-card>
</template>

<script>
import { getHistoryTaskByProcessInstanceId } from "@/apis/task";
import { formatDate } from "@/utils/datetime";
export default {
  name: "ProcessResult",
  data() {
    return {
      dataObject: {},
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    items() {
      const { data = {} } = this.dataObject;
      return data.content || [];
    },

    employees() {
      return this.dataObject.schemas.employees || {};
    },
  },
  created() {
    this.getData();
  },
  methods: {
    formatDate,
    async getData() {
      const { data } = await getHistoryTaskByProcessInstanceId(this.id);
      this.dataObject = data;
    },
  },
};
</script>

<style></style>
