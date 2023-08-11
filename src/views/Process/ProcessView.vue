<template>
  <div>
    <v-form>
      <v-container fluid>
        <!-- 选择人员 -->
        <ProcessControllerVue :id="id" @success="handleSuccess" />
      </v-container>
    </v-form>
  </div>
</template>

<script>
import ProcessControllerVue from "./components/ProcessController.vue";
import { closeBrowser } from "@/utils/desktop";
export default {
  name: "ProcessView",
  components: {
    ProcessControllerVue,
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    handleSuccess() {
      // 根据指定参数跳转：window.top.publicProps.returnUrl
      let publicProps = window.top.publicProps || {};
      let returnUrl =
        publicProps.returnUrl || window.localStorage.getItem("returnUrl") || "";
      if (returnUrl) {
        if (returnUrl === "app") closeBrowser();
        else window.top.location.href = returnUrl;
      } else {
        this.$router.back();
      }
    },
  },
};
</script>

<style></style>
