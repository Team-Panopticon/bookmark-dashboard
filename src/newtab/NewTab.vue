<template lang="">
  <Desktop></Desktop>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Desktop from "./pages/Desktop.vue";

export default defineComponent({
  name: "Popup",
  components: { Desktop },
  methods: {},
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
