<template>
  <div v-if="show" class="context-menu" :style="cssVars">
    <slot></slot>
  </div>
</template>

<script>
export default {
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
  computed: {
    cssVars() {
      return {
        "--top": `${this.position.y}px`,
        "--left": `${this.position.x}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  top: var(--top, 0);
  left: var(--left, 0);
  border: 1px solid black;
  background-color: white;
}
</style>
