<template lang="">
  <Desktop :items="bookmarks"></Desktop>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Desktop from "./pages/Desktop.vue";
import { Item } from "../shared/types/store";

export default defineComponent({
  name: "Popup",
  components: { Desktop },
  data() {
    return {
      bookmarks: [] as Item[],
    };
  },
  async mounted() {
    this.bookmarks = await chrome.bookmarks.getTree().then(async (tree) => {
      const [main, _] = tree[0].children || [];
      return main.children || [];
    });
  },
});
</script>
<style lang="scss"></style>
