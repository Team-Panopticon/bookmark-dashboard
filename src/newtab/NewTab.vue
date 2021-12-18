<template lang="">
  <Folder :item="bookmarks"></Folder>
</template>
<script>
import { defineComponent } from "vue";
import Folder from "./components/Folder.vue";

export default defineComponent({
  name: "Popup",
  components: { Folder },
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
