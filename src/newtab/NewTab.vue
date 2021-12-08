<template lang="">
  <div>{{ JSON.stringify(bookmarks) }}</div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Popup",
  data: function () {
    return {
      bookmarks: [],
    };
  },
  async mounted() {
    this.bookmarks = await chrome.bookmarks.getTree().then(async (tree) => {
      const [main, _] = tree[0].children;
      return await chrome.bookmarks.getChildren(main.id);
    });
  },
});
</script>
<style lang="scss"></style>
