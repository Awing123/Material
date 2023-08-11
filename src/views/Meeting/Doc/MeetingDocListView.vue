<template>
  <MobileMeetingDocList v-if="$vuetify.breakpoint.mobile" />
  <MeetingDocList v-else />
</template>

<script>
import MeetingDocList from "./MeetingDocList.vue";
import MobileMeetingDocList from "./MobileMeetingDocList.vue";

export default {
  components: {
    MeetingDocList,
    MobileMeetingDocList,
  
  },
};
</script>
