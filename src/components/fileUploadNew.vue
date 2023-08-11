<template>
  <v-card
    class="mb-6"
    :class="{ 'elevation-0 transparent': schema.transparent }"
  >
    <v-card-title :class="{ 'pa-0 common-font-size': schema.dense }">
      <span>{{ label }}</span>
      <v-btn
        v-if="!schema.readonly"
        color="primary"
        class="uploadBtn"
        @click="fileInput_click"
        >上传附件<v-icon right> mdi-upload </v-icon></v-btn
      >
    </v-card-title>
    <v-card-text :class="{ 'pa-0': schema.dense }">
      <v-file-input
        v-show="false"
        v-model="files"
        multiple
        hide-details
        :label="label"
        :disabled="disabled"
        :rules="rules"
        :required="required"
        :name="fullKey"
        ref="file_input"
        @change="upload"
      >
      </v-file-input>
      <v-list
        v-if="value && value.length > 0"
        :class="{ transparent: schema.transparent, 'pa-0': schema.dense }"
      >
        <v-list-item v-for="(item, i) in value" :key="i" dense>
          {{ i + 1 }}.<a href="javascript:;" @click="download(item.url)">{{
            getFileName(item)
          }}</a>
          <v-list-item-action v-if="!schema.readonly"
            ><v-icon color="error" @click="deleteFile(item)"
              >mdi-delete-circle-outline</v-icon
            ></v-list-item-action
          >
        </v-list-item>
      </v-list>
      <div v-else class="text-center">
        {{ schema.readonly ? "无附件" : "未上传附件" }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { request } from "@/utils/uploadrequest";
export default {
  props: {
    value: { type: Array, default: [] },
    options: { type: Object, required: true },
    schema: { type: Object, required: true },
    fullSchema: { type: Object, required: true },
    fullKey: { type: String, required: true },
    label: { type: String, default: "" },
    htmlDescription: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    rules: { type: Array, required: true },
    success: {
      type: Function,
      default: null
    },
  },
  data: () => ({
    files: [],
  }),
  methods: {
    fileInput_click() {
      this.$refs.file_input.$el.children[1].children[0].children[0].children[1].click();
    },
    deleteFile(file) {
      const array = []
      let i = -1
      this.value.forEach(function (item, index) {
        if (file.id !== item.id ) {
          i = index
        } else {
          array.push(item)
        }
      })
      if (i !== -1) {
        this.value.splice(i, 1)
      }
      this.success(array)
    },
    async upload() {
      console.log(this.files);
      let url = "/resources/org-user/v1/upload";

      let that = this
      this.files.forEach((file) => {
        let params = { module: this.schema.module || "meeting", files: file };
        request.upload(url, params).then((res) => {
          console.log("文件上传", res);
          let data = res.data || [];

          const temp = data[0]
          delete temp['id'];
          temp.title = this.getFileName(temp)
          that.value.push(temp)
          console.log(that.value)
          that.success(that.value)
        });
      });

    },
    download(url) {
      request.downloadNew(url).then((res) => console.log(res));
    },
    getFileName(item) {
      console.log(
        "getFileName",
        item.url.substring(item.url.lastIndexOf("/") + 1, item.length)
      );
      return item.url.substring(item.url.lastIndexOf("/") + 1, item.length);
    },
  },
};
</script>

<style lang="sass" scoped>
.uploadBtn
  margin-left: calc(50% - 54px)
.common-font-size
  font-size: 1rem
</style>
