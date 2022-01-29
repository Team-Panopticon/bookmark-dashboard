<template>
  <div
    class="context-menu-wrapper"
    v-if="target.type === 'FOLDER' || target.type === 'FILE'"
  >
    <button class="context-menu-item">Edit</button>
    <button class="context-menu-item">Delete</button>
  </div>
  <div class="context-menu-wrapper" v-else>
    <button class="context-menu-item">Create File</button>
    <button class="context-menu-item">Create Folder</button>
  </div>
</template>

<script lang="ts">
import { ContextMenuTarget } from "@/newtab/store/modules/contextMenu";
import { defineComponent, PropType } from "@vue/runtime-core";
export default defineComponent({
  props: {
    target: {
      require: true,
      type: Object as PropType<ContextMenuTarget>,
    },
  },
});
</script>

<style lang="scss" scoped>
.context-menu-wrapper {
  display: flex;
  flex-direction: column;

  .context-menu-item {
    padding: 4px 8px;
    text-align: start;
    &:hover {
      background-color: rgba(54, 69, 79, 0.2);
      cursor: pointer;
    }
  }
}
</style>
