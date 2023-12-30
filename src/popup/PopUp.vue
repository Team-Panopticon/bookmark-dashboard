<template lang="">
  <v-card>
    <v-card-title>Bookmark Dashboard</v-card-title>
    <v-card-subtitle>{{ version }}</v-card-subtitle>
    <v-card-text
      >Manage your bookmarks in a simple dashboard
      <a
        class="icon-attribute"
        href="https://www.flaticon.com/free-icons/electronics"
        target="_blank"
        title="electronics icons"
        >icon by surang - Flaticon</a
      >
    </v-card-text>
    <v-card-text
      >DARK_MODE
      <input type="checkbox" v-model="darkMode" />
    </v-card-text>
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
<script lang="ts">
import { MODE } from "@/shared/types/store";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Popup",
  data() {
    return {
      version: "v" + process.env.VUE_APP_VERSION,
    };
  },
  computed: {
    darkMode: {
      get(): boolean {
        return localStorage.getItem("mode") === MODE.DARK;
      },
      set(isDarkMode: boolean) {
        return localStorage.setItem(
          "mode",
          isDarkMode ? MODE.DARK : MODE.LIGHT
        );
      },
    },
  },
});
</script>
<style lang="scss">
.container {
  width: 500px;
}
.icon-attribute {
  display: block;
  font-size: 12px;
  padding-top: 4px;
}
</style>
