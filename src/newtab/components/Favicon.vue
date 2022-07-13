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
      v-if="showImgIcon"
    />
    <span class="favicon" v-else>
      {{ replaceChar }}
    </span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import LoadingImg from "../../assets/loding.gif";
import Blank from "../../assets/blank.png";

const PREFIX = "https://www.google.com/s2/favicons?sz=64&domain=";

export default defineComponent({
  props: {
    url: {
      type: String,
      required: true,
    },
    replaceChar: String,
  },
  data: () => ({
    isLoading: true,
    loadingImage: LoadingImg,
    imgSrc: "",
    showImgIcon: true,
    randomColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  }),
  created() {
    this.imgSrc = PREFIX + this.url;
  },
  methods: {
    loadImage(e: Event) {
      const targetImg = e.target as HTMLImageElement;
      if (targetImg.width <= 16 || targetImg.height <= 16) {
        this.showImgIcon = false;
      }
      this.isLoading = false;
    },

    notFoundImage() {
      this.imgSrc = Blank;
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
  z-index: 999;

  .favicon {
    width: 48px;
    height: 48px;
    font-size: 48px;

    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 600;
    color: v-bind("randomColor");
  }

  .disable {
    display: none;
  }
}
</style>
