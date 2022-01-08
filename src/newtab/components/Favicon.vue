<template>
  <div class="favicon-wrapper">
    <img class="favicon" :src="src" alt="icon" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

const PRE_FIX = "https://www.google.com/s2/favicons?domain=";

export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  computed: {
    src() {
      return PRE_FIX + this.url;
    },
  },
});
</script>
<style lang="scss" scoped>
.favicon-wrapper {
  min-width: 50px;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  background-color: #e9e9e9;
  z-index: 999;

  .favicon {
    width: 24px;
    height: 24px;
  }
}
</style>
