<template>
  <v-data-table
    light
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :server-items-length="totalElements"
    @update:page="fetchData"
    @update:items-per-page="handleUpdatePageSize"
    class="elevation-1"
    :loading="loading"
    v-bind="$attrs"
  >
    <template v-slot:top>
      <div class="d-flex flex-wrap pa-2 mb-2 tool-bar">
        <slot name="search"></slot>
        <v-btn class="ma-2" color="primary" @click="fetchData(1)">查询</v-btn>
        <slot name="actions"></slot>
      </div>
    </template>

    <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    getData: {
      type: Function,
      require: true,
    },
    headers: {
      type: Array,
      require: true,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      loading: false,
      items: [],
      pageSize: 10,
      totalElements: 0,
    };
  },
  created() {
    this.pageSize = this.itemsPerPage || this.pageSize;
    this.fetchData(1);
  },
  methods: {
    async fetchData(currentPage = 1) {
      this.loading = true;
      try {
        const { error, data } = await this.getData({
          currentPage,
          pageSize: this.pageSize,
        });

        if (error) return;

        this.items = data.content || [];
        this.totalElements = data.totalElements || 0;
      } finally {
        this.loading = false;
      }
    },
    handleUpdatePageSize(pageSize) {
      this.pageSize = pageSize === -1 ? this.totalElements : pageSize;
      this.fetchData();
    },
    async reset() {
      this.fetchData(1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
