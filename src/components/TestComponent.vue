<template>
  <div>
    <v-card>
      <v-card-title primary-title> 测试组件 </v-card-title>
      <v-btn class="ma-4" color="primary" @click="onLoading">测试Loading</v-btn>
      <v-btn class="ma-4" color="primary" @click="onConfirm">测试mtCategoryName</v-btn>
    </v-card>

    <v-card class="mt-10">
      <v-card-title> 加解密测试 </v-card-title>
    </v-card>

    <v-card height="300px">
      <PullUpComponent class="mt-10" :refresh-data="requestData" :no-more="noMore">
        <v-card flat tile>
          <v-list-item three-line v-for="i of data" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{
                i % 5 === 0 ? "scroll up 👆🏻" : `I am item ${i} `
              }}</v-list-item-title>
              <v-list-item-subtitle>
                Secondary line text Lorem ipsum dolor sit amet,
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                consectetur adipiscing elit.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </PullUpComponent>
    </v-card>
  </div>
</template>

<script>
import aes from "@/utils/security";
export default {
  data() {
    return {
      data: 30,
      noMore: false,
    };
  },
  created() {
    console.log(this.decodeRes());
  },
  methods: {
    onLoading() {
      const loading = this.$loading();
      setTimeout(() => {
        loading.close();
      }, 2000);
    },
    onConfirm() {
      this.$confirm({
        title: "警告⚠️",
        content: "是否删除？",
      })
        .then(() => console.log("confirm"))
        .catch(() => console.log("cancel"));
    },
    decodeRes() {
      aes.formatRes({
        data: "DVJppHN+fwkoxn1l41f+BDv47HRWLbUpxTpcGxebq/jMAZHZqSpcRRi31I2r pEIpzAyMhPGFDbczH6h9QNFFsriqcvF1ux7bTYgY0rxwhu04GrSjYGEB7BX6 JTCn5sO6QHMeWVUQmNouhcV5er3DO9W+gX0a5vh1oTsgci3oEQsrIFEzVO1G fSJyZ/8dZA0sj9QbkRKZ1lgHPTj8iQZLyQ==",
      });
    },
    async requestData() {
      try {
        const newData = await this.ajaxGet(/* url */);
        if (newData === 0) this.noMore = true;
        else this.data += newData;
      } catch (err) {
        // handle err
        console.log(err);
      }
    },
    ajaxGet(/* url */) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.data > 50 ? 0 : 20);
        }, 1000);
      });
    },
  },
};
</script>

<style></style>
