<template lang="">
  <Desktop></Desktop>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Desktop from "./pages/Desktop.vue";
import BookmarkApi from "./utils/bookmarkApi";
import { mapMutations } from "vuex";

export default defineComponent({
  name: "Popup",
  components: { Desktop },
  methods: {
    ...mapMutations(["setBookmarkTree"]),
  },
  async mounted() {
    this.setBookmarkTree(await BookmarkApi.getTree());
  },
});
</script>
<style lang="scss">
#newtab {
  height: 100vh;
}
</style>
