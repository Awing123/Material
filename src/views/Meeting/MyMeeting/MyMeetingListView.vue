<template>
  <MobileMyMeetingList v-if="$vuetify.breakpoint.mobile" />
  <MyMeetingList v-else />
</template>

<script>
import MyMeetingList from "./MyMeetingList.vue";
import MobileMyMeetingList from "./MobileMyMeetingList.vue";
export default {
  components: {
    MyMeetingList,
    MobileMyMeetingList,
  },
};
</script>
