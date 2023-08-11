<template>
  <v-sheet class="d-flex flex-column">
    <div class="d-flex flex-grow-1">
      <CenterSideBar :menus="menus" @toggle="handleToggle" />

      <v-container class="pl-0 pr-0" fluid>
        <v-row>
          <v-col offset="4" md="4">
            <v-text-field
              label="搜索"
              placeholder="输入应用名称..."
              filled
              rounded
              solo
              dense
              v-model="search"
            ></v-text-field>
          </v-col>
        </v-row>

        <CenterAll :list="appsWithSearch" />
      </v-container>
    </div>
  </v-sheet>
</template>

<script>
import CenterSideBar from "./components/CenterSideBar.vue";
import CenterAll from "./CenterAll.vue";

export default {
  components: {
    CenterSideBar,
    CenterAll,
  },
  data() {
    return {
      apps: [],
      search: "",
    };
  },
  computed: {
    menus() {
      return this.apps.map((i) => i.title);
    },
    appsWithSearch() {
      if (this.search) {
        return this.apps
          .map((i) => ({
            title: i.title,
            apps: i.apps
              ? i.apps.filter((i) => i.name.includes(this.search))
              : [],
          }))
          .filter((i) => i.apps.length);
      }

      return this.apps;
    },
  },
  async created() {
    await this.$store.dispatch("getUserInfo");
    this.apps = this.buildModuleTree(this.$store.getters.permissions);
  },
  methods: {
    handleToggle(data) {
      const target = document.querySelector("#" + data);
      if (!target) return;
      document.querySelector("#" + data).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    },
    buildModuleTree(list = []) {
      // 根据moduleName分组
      const modulesArray = [];
      const result = list.reduce((modules, current) => {
        current = {
          ...current,
          icon: current.resourceIcon,
          name: current.resourceTitle,
          path: window.location.origin + current.resourceFormUri,
          iframe: true,
        };

        if (modules[current.moduleName]) {
          modules[current.moduleName].apps.push(current);
        } else {
          modules[current.moduleName] = {
            title: current.moduleTitle,
            apps: [current],
          };

          modulesArray.push(current.moduleName);
        }

        return modules;
      }, {});

      return modulesArray.map((i) => result[i]);
    },
  },
};
</script>

<style lang="scss"></style>
