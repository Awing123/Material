<template>
  <v-dialog
    v-model="dialog"
    scrollable
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn text v-bind="attrs" v-on="on">
        <v-icon>mdi-apps</v-icon>
        应用中心
      </v-btn>
    </template>

    <v-card class="d-flex flex-column">
      <v-toolbar dark color="primary lighten-1" class="flex-grow-0">
        <v-toolbar-title>应用菜单</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            关闭<v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="pa-0" height="100%">
        <CenterIndex style="min-height: 92vh" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import CenterIndex from "../CenterIndex.vue";
export default {
  components: {
    CenterIndex,
  },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
