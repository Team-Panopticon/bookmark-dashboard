<template>
  <div
    v-show="isShow"
    v-if="currentTarget"
    class="context-menu"
    :style="cssVars"
    ref="container"
  >
    <v-card elevation="2" class="context-card" outlined>
      <ContextMenuContent :target="currentTarget" />
    </v-card>
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
  border: 0.8px rgba(0, 0, 0, 0.8);
  min-width: 64px;
  z-index: 2147483647;

  border-radius: 6px;
  overflow: hidden;

  background-color: rgba(87, 87, 86, 0.94);

  border-color: white;

  padding: 1px;
  .context-card {
    border-radius: 4.6px;
    padding: 2px 4px;
    border: 0.1px solid rgba(255, 255, 255, 0.3);
    font-weight: 500;
    color: white;
    background: transparent;
  }
}
</style>
