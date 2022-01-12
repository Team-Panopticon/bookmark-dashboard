<template lang="">
  <Desktop :items="bookmarks"></Desktop>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Desktop from "./pages/Desktop.vue";
import { Item } from "../shared/types/store";
import BookmarkApi from "./utils/bookmarkApi";

export default defineComponent({
  name: "Popup",
  components: { Desktop },
  data() {
    return {
      bookmarks: [] as Item[],
    };
  },
  async mounted() {
    this.bookmarks = await BookmarkApi.getTree();
  },
});
</script>
<style lang="scss">
#newtab {
  height: 100vh;
}
</style>
