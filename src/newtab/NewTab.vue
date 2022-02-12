<template lang="">
  <Desktop></Desktop>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Desktop from "./pages/Desktop.vue";
import BookmarkApi from "./utils/bookmarkApi";
import { mapMutations } from "vuex";
import { SET_BOOKMARK_TREE } from "./store";

export default defineComponent({
  name: "Popup",
  components: { Desktop },
  async mounted() {
    this.setBookmarkTree(await BookmarkApi.getTree());
  },
  methods: {
    ...mapMutations([SET_BOOKMARK_TREE]),
  },
});
</script>
<style lang="scss">
#newtab {
  height: 100vh;
}
html {
  overflow-y: auto !important;
}
</style>
