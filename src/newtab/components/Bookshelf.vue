<template>
  <div class="flex-container">
    <div v-for="(file, i) in item" v-bind:key="i">
      <v-btn
        class="btn"
        tile
        elevation="0"
        @dblclick="openFolder(file.children)"
        v-if="file.children"
      >
        <div class="item-container">
          <v-icon x-large class="item-icon">mdi-folder</v-icon>
          <p class="item-title">
            {{ file.title }}
          </p>
        </div>
      </v-btn>

      <v-btn
        v-else
        class="btn"
        tile
        elevation="0"
        @dblclick="openUrl(file.id, file.url)"
      >
        <div class="item-container">
          <v-icon x-large class="item-icon">mdi-web</v-icon>
          <p class="item-title">
            {{ file.title }}
          </p>
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item, Items } from "../../shared/types/store";

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  methods: {
    openFolder(children: Items) {
      this.$emit("openFolder", children);
    },
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
    },
  },
});
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 40px;
  gap: 16px;
}

.btn {
  width: 100px;
  height: 120px;
}
.btn:focus {
  background-color: rgb(225, 225, 225);
}

.item-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.item-icon {
  font-size: 60px;
  color: #36454f;
}

.item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  line-height: 1.2em;
  height: 3.6em;
  color: #36454f;
}
</style>
