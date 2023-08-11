<template>
  <MenusContainer
    :menus="permissionMenus"
    :show-menu="!isFromWorkbench"
    :app="true"
  />
</template>

<script>
import { ROLE_TYPE } from "@/types/role.type";
import MenusContainer from "@/components/MenusContainer";
export default {
  components: {
    MenusContainer,
  },
  data() {
    return {
      menus: [
        {
          title: "会议管理",
          active: true,
          children: [
            {
              title: "会议室管理",
              path: "/meetingManager/room",
         
            },
            {
              title: "单位会议",
              path: "/meetingManager/unit",
       

            },
            {
              title: "会议管理",
              path: "/meetingManager/doc",
            },
            {
              title: "我的会议",
              path: "/meetingManager/mymeeting",
            }
          ],
        }
      ],
    };
  },
  computed: {
    isFromWorkbench() {
      return this.$route.query.type;
    },
    permissionMenus() {
      const rolesList = this.$store.getters.rolesList;
      console.log('start_role')
      console.log(rolesList)
      console.log('end_role')
      const originList = this.menus.reduce((list, current) => {
        const item = { ...current };
        item.children = [...item.children];
        list.push(item);
        return list;
      }, []);

      const result = originList.filter((parent) => {
        parent.children = parent.children.filter(
          (i) =>
            i.permission === undefined ||
            rolesList.some((role) => role.includes(i.permission))
        );

        return (
          parent.permission === undefined ||
          rolesList.some((role) => role.includes(parent.permission))
        );
      });

      return result;
    },
  },
  async created() {
    await this.$store.dispatch("getRoles");
  },
};
</script>

<style></style>
