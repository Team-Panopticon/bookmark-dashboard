<template lang="">
  <div>new tab에서 보여지는 페이지 입니다.</div>
  <Folder :Item="bookmarks"></Folder>
</template>
<script>
import { defineComponent } from "vue";
import Folder from "./components/Folder.vue";
import { mockData } from "./constant";

export default defineComponent({
  name: "Popup",
  components: { Folder },
  data() {
    return {
      bookmarks: [],
    };
  },
  async mounted() {
    this.bookmarks = chrome
      ? await chrome.bookmarks.getTree().then(async (tree) => {
          const [main, _] = tree[0].children;
          return await chrome.bookmarks.getChildren(main.id);
        })
      : mockData;
  },
});
</script>
<style lang="scss"></style>
