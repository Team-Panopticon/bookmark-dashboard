<template>
  <div v-show="show" class="context-menu" :style="cssVars" ref="container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export interface Position {
  x: number;
  y: number;
}

export default defineComponent({
  mounted() {
    window.addEventListener("click", this.onClickOutside);
    window.addEventListener("contextmenu", this.onClickOutside, {
      capture: true,
    });
  },
  unmounted() {
    window.removeEventListener("click", this.onClickOutside);
    window.removeEventListener("contextmenu", this.onClickOutside);
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:show"],
  computed: {
    cssVars() {
      return {
        "--top": `${this.position.y}px`,
        "--left": `${this.position.x}px`,
      };
    },
  },
  methods: {
    onClickOutside(event: MouseEvent) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement) return;
      const parentContextMenu = targetElement.closest(".context-menu");
      const clickedOutside = parentContextMenu !== this.$refs.container;
      if (clickedOutside) {
        this.$emit("update:show", false);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  top: var(--top, 0);
  left: var(--left, 0);
  border: 1px solid black;
  background-color: white;
  min-width: 64px;
  z-index: 1000;
}
</style>
