<template lang="">
  <Desktop :item="bookmarks"></Desktop>
</template>
<script>
import { defineComponent } from "vue";
import Desktop from "./pages/Desktop";

export default defineComponent({
  name: "Popup",
  components: { Desktop },
  data() {
    return {
      bookmarks: [],
    };
  },
  async mounted() {
    this.bookmarks = await chrome.bookmarks.getTree().then(async (tree) => {
      const [main, _] = tree[0].children;
      return main.children;
    });
  },
});
</script>
<style lang="scss"></style>
