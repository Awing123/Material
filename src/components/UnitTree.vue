<template>
  <v-card>
    <v-toolbar color="primary" dark flat>
      <v-icon>mdi-account-multiple-plus</v-icon>
      <v-toolbar-title>{{ title }}树</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col>
        <v-card-text>
          <v-treeview
            :active.sync="active"
            :load-children="fetch"
            :items="items"
            activatable
            return-object
            expand-icon="mdi-chevron-down"
            open-all
          >
          </v-treeview>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: ["url", "title", "items"],
  data: () => ({
    active: [],
  }),

  watch: {
    active(val) {
      if (val.length > 0) {
        // console.log("watch", val[0]);
        this.$emit("activeChange", val[0]);
      } else {
        console.log("watch", val);
      }
    },
  },

  methods: {
    fetch(item) {
      let options = {
        headers: {
          Authorization: localStorage.token,
        },
      };
      return fetch(this.url + `?parentId=${item.id}`, options)
        .then((res) => res.json())
        .then((res) => {
          console.log("tree", res.data);
          res.data.content.forEach((item) => (item.children = []));
          item.children.push(...res.data.content);
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>