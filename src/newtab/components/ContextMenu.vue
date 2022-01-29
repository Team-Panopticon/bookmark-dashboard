<template>
  <div v-show="isShow" class="context-menu" :style="cssVars" ref="container">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import store from "../store/index";
import { mapGetters } from "vuex";
import {
  GET_CONTEXT_MENU_CSS_VARS,
  GET_CONTEXT_MENU_SHOW_STATE,
  SET_CONTEXT_MENU_SHOW_STATE,
} from "../store/modules/contextMenu";

export default defineComponent({
  mounted() {
    window.addEventListener("mousedown", this.onClickOutside, {
      capture: true,
    });
    window.addEventListener("contextmenu", this.onClickOutside, {
      capture: true,
    });
  },
  unmounted() {
    window.removeEventListener("mousedown", this.onClickOutside);
    window.removeEventListener("contextmenu", this.onClickOutside);
  },
  computed: {
    ...mapGetters({ cssVars: GET_CONTEXT_MENU_CSS_VARS }),
    ...mapGetters({ isShow: GET_CONTEXT_MENU_SHOW_STATE }),
  },
  methods: {
    onClickOutside(event: MouseEvent) {
      const targetElement = event.target as HTMLElement;
      if (!targetElement) return;
      const parentContextMenu = targetElement.closest(".context-menu");
      const clickedOutside = parentContextMenu !== this.$refs.container;
      if (clickedOutside) {
        store.commit(SET_CONTEXT_MENU_SHOW_STATE, false);
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
