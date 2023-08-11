<template>
  <v-app-bar app clipped-left color="#3880ff" dark height="64">
    <v-img
      v-if="organization.logo"
      max-height="45"
      max-width="45"
      :src="organization.logo"
      alt="logo"
      class="mr-4"
    />

    <h3 class="mr-8 flex-shrink-0" text v-if="organization.name">
      {{ organization.name }}
    </h3>

    <div class="flex-shrink-0">
      <CenterDialog />
      <v-btn
        text
        v-for="link in links"
        :key="link.id"
        @click="onTabClick(link)"
      >
        <v-icon class="mr-2">{{ link.icon }}</v-icon>
        {{ link.title }}</v-btn
      >

      <!-- 后退按钮 -->
      <v-btn text @click="goBack" v-if="!$route.meta.hideBack">
        <v-icon>mdi-arrow-left</v-icon>
        后退
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-chip
          label
          v-bind="attrs"
          v-on="on"
          class="mr-2 flex-shrink-0"
          color="indigo"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          {{ loginInfo.name || "请登录" }}
        </v-chip>
      </template>
      <v-list dense>
        <v-list-item
          v-for="(item, index) in configItems"
          :key="index"
          @click="executeOptionsMethod(item.method)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="passwordDialog" max-width="500px">
      <ResetPassword :data="passwordFormModel" @save="handleSavePassword" />
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { loadUserInfo } from "@/utils/desktop";
import { resetPassword } from "@/apis/auth";
import CenterDialog from "@/views/Center/components/CenterDialog.vue";
import ResetPassword from "@/views/User/ResetPassword.vue";
import { getClient } from "@/utils/desktop";
export default {
  components: {
    CenterDialog,
    ResetPassword,
  },
  data() {
    return {
      passwordDialog: false,
      loginInfo: {},
      activeItem: {},
      items: [],
      activeLink: 0,
      passwordFormModel: {
        currentPassword: "",
        password: "",
        confirmPassword: "",
      },
      links: [
        {
          title: "工作台",
          id: "workbench",
          icon: "mdi-monitor-dashboard",
        },
        {
          title: "通讯录",
          id: "contacts",
          icon: "mdi-contacts",
          path: "/contact",
        },
      ],
      configItems: [
        {
          title: "重设密码",
          id: "resetPassword",
          method: "onResetPassword",
        },
        {
          title: "查看权限",
          id: "roles",
          method: "onCheckRoles",
        },
        {
          title: "退出账号",
          id: "logout",
          method: "onLogout",
        },
      ],
    };
  },
  computed: {
    organization() {
      return this.loginInfo.organization || {};
    },
    user() {
      return this.loginInfo.user || {};
    },
    isDesktop() {
      return !!window.desktop;
    },
  },
  created() {
    this.activeItem = this.items[0];
    this.switchTabByRouteName();
    if (this.isDesktop) {
      this.getUser();
    }
  },
  methods: {
    async getUser() {
      const res = await loadUserInfo();
      this.loginInfo = res.current;
    },
    switchTabByRouteName() {
      let routeName = this.$route.name;
      switch (routeName) {
        case "WorkbenchIndex":
          this.activeLink = 0;
          break;
        case "CenterIndex":
          this.activeLink = 1;
          break;
        case "ContactsIndex":
          this.activeLink = 2;
          break;
        case "CarsIndex":
          this.activeLink = 3;
          break;
        default:
          this.activeLink = 0;
          break;
      }
    },
    goBack() {
      window.top.history.back();
    },
    logout() {
      window.desktop.logout();
    },
    onTabClick(item) {
      if (item.href) {
        this.$router.push({
          name: "AppFrame",
          query: {
            url: item.href,
          },
        });
      } else {
        this.$router.push({
          path: item.path || "/workbench",
        });
      }
    },
    executeOptionsMethod(method) {
      if (method && typeof this[method] === "function") {
        this[method].call(this);
      }
    },
    onCheckRoles() {
      this.$confirm({
        title: "当前用户角色权限",
        content: this.$store.getters.rolesList,
      });
    },
    onResetPassword() {
      Object.keys(this.passwordFormModel).forEach(
        (i) => (this.passwordFormModel[i] = "")
      );
      this.passwordDialog = true;
    },
    async handleSavePassword() {
      const { error } = await resetPassword(this.passwordFormModel);
      if (error) return;

      this.passwordDialog = false;
      return this.$message.success("修改成功");
    },
    onLogout() {
      getClient().logout();
    },
  },
};
</script>

<style></style>
