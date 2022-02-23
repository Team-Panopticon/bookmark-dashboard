<template>
  <div class="favicon-wrapper">
    <img
      :class="isLoading ? `favicon` : `disable`"
      :src="loadingImage"
      alt="loading"
    />
    <img
      :class="isLoading ? `disable` : `favicon`"
      :src="imgSrc"
      @load="loadImage"
      @error="notFoundImage"
      alt="icon"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LoadingImg from "../../assets/loding.gif";
import NotFoundImg from "../../assets/not-found.png";

const PREFIX = "https://www.google.com/s2/favicons?sz=64&domain=";

export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data: () => ({ isLoading: true, loadingImage: LoadingImg, imgSrc: "" }),
  created() {
    this.imgSrc = PREFIX + this.url;
  },
  methods: {
    loadImage() {
      this.isLoading = false;
    },

    notFoundImage() {
      this.imgSrc = NotFoundImg;
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
    width: 48px;
    height: 48px;
  }

  .disable {
    display: none;
  }
}
</style>
