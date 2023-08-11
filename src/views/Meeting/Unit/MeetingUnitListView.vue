<template>
  <MobileMeetingUnitList v-if="$vuetify.breakpoint.mobile" />
  <MeetingUnitList v-else />
</template>

<script>
import MeetingUnitList from "./MeetingUnitList.vue";
import MobileMeetingUnitList from "./MobileMeetingUnitList.vue";
export default {
  components: {
    MeetingUnitList,
    MobileMeetingUnitList,
  },
};
</script>
