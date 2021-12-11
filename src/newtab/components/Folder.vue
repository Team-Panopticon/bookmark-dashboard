<template>
  <div class="flex-container">
    <div v-for="child in Item" :key="child.id">
      <v-card class="card" outlined tile @click="open(child.id, child.url)">{{
        child.title
      }}</v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item } from "../../shared/types/store";

export default defineComponent({
  setup() {
    return {};
  },
  props: {
    Item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  methods: {
    open(id: string, url: string) {
      console.log(`${id}자식을 클릭했어요!`);
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

.card {
  width: 100px;
  height: 120px;
}
</style>
