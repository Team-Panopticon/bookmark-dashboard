<template lang="">
  <div>new tab에서 보여지는 페이지 입니다.</div>
  <Folder :Item="Items"></Folder>
</template>
<script>
import { defineComponent } from "vue";
import Folder from "./components/Folder.vue";

const dummyFiles = [
  { id: 1, title: "Naver", url: "https://www.naver.com", type: "file" },
  { id: 2, title: "Google", url: "https://www.google.com", type: "file" },
  {
    id: 3,
    title: "dir1",
    type: "folder",
    children: {
      id: 4,
      title: "file1",
      url: "https://google.com",
      type: "file",
    },
  },
];

export default defineComponent({
  name: "Popup",
  components: { Folder },
  data() {
    return {
      Items: dummyFiles,
    };
  },
});
</script>
<style lang="scss"></style>
