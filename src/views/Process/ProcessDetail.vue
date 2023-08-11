<template>
  <!-- 流程注册 -->
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isEdit ? "编辑" : "注册" }}流程</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="form.processName"
                prepend-icon="mdi-account"
                label="流程名称"
                required
                :rules="nameRules"
              ></v-text-field>

              <v-file-input
                v-model="form.processXml"
                label="流程图"
                :rules="xmlRules"
              ></v-file-input>

              <v-text-field
                v-model="form.processForm"
                prepend-icon="mdi-file-document"
                label="流程表单"
                required
                :rules="formRules"
              ></v-text-field>

              <v-btn
                type="submit"
                :loading="loading"
                color="primary"
                @click="handleSubmit"
              >
                {{ isEdit ? "保存" : "提交" }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        processName: "", // 流程名称
        processForm: "", // 流程表单, url地址
        processXML: null, // 流程XML文件, file文件对象
      },
      nameRules: [
        (v) => !!v || "流程名称不能为空",
        (v) => v.length <= 20 || "流程名称不能超过20个字符",
      ],
      xmlRules: [(v) => !!v || "流程XML文件不能为空"],
      formRules: [(v) => !!v || "流程表单不能为空"],
    };
  },
  computed: {
    isEdit() {
      return this.$route.name === "ProcessEdit";
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          console.log("success submit.");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style></style>
