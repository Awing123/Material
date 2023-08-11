<template>
  <v-card class="mb-6">
    <v-card-title>
      <span>{{ label }}</span>
      <v-btn
        v-if="!schema.readonly"
        color="primary"
        class="uploadBtn"
        @click="fileInput_click"
        >上传附件<v-icon right> mdi-upload </v-icon></v-btn
      >
    </v-card-title>
    <v-card-text>
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
        class="pt-0"
        ref="file_input"
        @change="upload"
      >
        <template #selection="{ text }">{{ text }} </template>
      </v-file-input>
      <v-list v-if="fileList && fileList.length > 0">
        <v-list-item v-for="(item, i) in fileList" :key="i" dense>
          <div v-if="item.fileUrl">
            {{ i + 1 }}.<a href="javascript:;" @click="download(item)">{{
              item.fileName
            }}</a>
          </div>
          <div v-else>
            {{ i + 1 }}.<a href="javascript:;" @click="view(item)">{{
              item.name
            }}</a>
          </div>
          <v-list-item-action v-if="!schema.readonly"
            ><v-icon color="error" @click="deleteFile(item)"
              >mdi-delete-circle-outline</v-icon
            ></v-list-item-action
          >
        </v-list-item>
      </v-list>
      <div v-else-if="schema.readonly" class="text-center">无附件</div>
    </v-card-text>
  </v-card>
</template>

<script>
import { request, oagw } from "@/apis/request";
export default {
  props: {
    value: { type: Array, default: "" },
    options: { type: Object, required: true },
    schema: { type: Object, required: true },
    fullSchema: { type: Object, required: true },
    fullKey: { type: String, required: true },
    label: { type: String, default: "" },
    htmlDescription: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    rules: { type: Array, required: true },
    on: { type: Object, required: true },
  },
  data: () => ({
    files: [],
    fileList: [],
  }),
  watch: {
    value: {
      handler(newValue) {
        console.log("newValue", newValue);
        this.fileList.length = 0;
        newValue.forEach((item) => this.fileList.push(item));
        console.log("this.fileList", this.fileList);
      },
    },
  },
  methods: {
    fileInput_click() {
      this.$refs.file_input.$el.children[1].children[0].children[0].children[1].click();
    },
    async deleteFile(item) {
      let confirmres = await window.confirm("确定删除这个附件吗？");
      if (!confirmres) return;
      let url =
        "/docexechange/gen-user/v1/docexchange/deleteGwjhAttach?attUuids=" +
        item.uuid;
      request.post(url, {}).then((res) => {
        alert(res.data.result);
        this.fileList = this.fileList.filter((file) => file.uuid != item.uuid);
        this.files = [];
      });
    },
    async upload() {
      if (!window.meetingParams) {
        let url = "getHytzFileInfo.do";
        let params = {};
        let res = await oagw.post(url, params, true);
        console.log("getHytzFileInfo", res);
        window.meetingParams = {};
        window.meetingParams.annexUploadUrl = res.data.annexUploadUrl || null;
        window.meetingParams.docId = res.data.docId || null;
      }

      console.log(this.files);
      let url = `/docexechange/gen-user/v1/docexchange/uploadGwjhFile?docUuid=${window.meetingParams.docId}`;

      this.files.forEach((file) => {
        let params = { file: file };
        request.upload(url, params).then((res) => {
          console.log("文件上传", res);
          let data = res.data || [];
          this.fileList.push(...data);
        });
      });
    },
    view(item) {
      request.view(item).then((res) => console.log(res));
    },
    download(item) {
      let attUuid = this.queryURLParams(item.fileUrl).attUuid;
      let fileName =
        item.fileName.indexOf(".txt") >= 0
          ? encodeURIComponent(item.fileName)
          : item.fileName;
      request.download(attUuid, fileName).then((res) => console.log(res));
    },
    queryURLParams(url) {
      let pattern = /(\w+)=(\w+)/gi; //定义正则表达式
      let parames = {}; // 定义参数对象
      url.replace(pattern, ($, $1, $2) => {
        parames[$1] = $2;
      });
      return parames;
    },
  },
};
</script>

<style lang="sass" scoped>
//.uploadBtn
//  margin-left: calc(50% - 108px)
</style>
