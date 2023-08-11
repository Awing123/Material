<!-- 底部导航栏 -->

<template>
  <BottomNavigation
    :items="permissionTabs"
    @change="handleChange"
    :activeIndex="activeIndex"
  />
</template>

<script>
import BottomNavigation from "@/components/BottomNavigation.vue";

export default {
  components: { BottomNavigation },
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      items: [
        {
          title: "我的会议",
          icon: "mdi-book-account-outline",
          path: "/meetingManager/mymeeting",
        },
        {
          title: "我的发布",
          icon: "mdi-book-plus-outline",
          path: "/meetingManager/doc",
        },
        {
          title: "单位会议",
          icon: "mdi-book-multiple-outline",
          path: "/meetingManager/unit",
        },
        {
          title: "会议室",
          icon: "mdi-home-edit-outline",
          path: "/meetingManager/room",
        }
      ],
    };
  },
  computed: {
    permissionTabs() {
      const rolesList = this.$store.getters.rolesList;
      return this.items.filter(
        (i) => !i.permission || rolesList.includes(i.permission)
      );
    },
  },
  methods: {
    handleChange(data) {
      this.$router.push({
        path: data.path,
      });
    },
  },
};
</script>

<style></style>
