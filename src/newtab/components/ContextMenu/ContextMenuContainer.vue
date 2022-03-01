<template>
  <div
    v-show="isShow"
    v-if="currentTarget"
    class="context-menu"
    :style="cssVars"
    ref="container"
  >
    <ContextMenuContent :target="currentTarget" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ContextMenuContent from "./ContextMenuContent.vue";
import store from "../../store/index";
import { mapGetters } from "vuex";
import {
  GET_CONTEXT_MENU_CSS_VARS,
  GET_CONTEXT_MENU_SHOW_STATE,
  GET_CONTEXT_MENU_TARGET,
  SET_CONTEXT_MENU_SHOW_STATE,
} from "../../store/modules/contextMenu";

export default defineComponent({
  components: { ContextMenuContent },
  computed: {
    ...mapGetters({ cssVars: GET_CONTEXT_MENU_CSS_VARS }),
    ...mapGetters({ isShow: GET_CONTEXT_MENU_SHOW_STATE }),
    ...mapGetters({ currentTarget: GET_CONTEXT_MENU_TARGET }),
  },
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
  min-width: 64px;
  z-index: 2147483647;

  border-radius: 6px;
  overflow: hidden;

  background-color: rgba(100, 91, 101, 0.95);
  color: white;
  font-weight: 500;
  padding: 2px 4px;
}
</style>
