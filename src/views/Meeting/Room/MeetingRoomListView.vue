<template>
  <MobileMeetingRoomList v-if="$vuetify.breakpoint.mobile" />
  <MeetingRoomList v-else />
</template>

<script>
import MeetingRoomList from "./MeetingRoomList.vue";
import MobileMeetingRoomList from "./MobileMeetingRoomList.vue";
export default {
  components: {
    MeetingRoomList,
    MobileMeetingRoomList,
  },
};
</script>
