<template lang="">
  <v-card>
    <v-card-title>Bookmark Dashboard</v-card-title>
    <v-card-subtitle>{{ version }}</v-card-subtitle>
    <v-card-text>Manage your bookmarks in a simple dashboard</v-card-text>
    <v-card-actions>
      <v-btn
        href="https://github.com/Team-Panopticon/bookmark-dashboard"
        target="_blank"
        >Github</v-btn
      >
      <v-btn
        href="https://github.com/Team-Panopticon/bookmark-dashboard/issues"
        target="_blank"
        >Suggestions</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Popup",
  data() {
    return {
      version: "v" + process.env.VUE_APP_VERSION,
    };
  },
});
</script>
<style lang="scss">
.container {
  width: 500px;
}
</style>
