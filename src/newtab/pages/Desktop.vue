<template>
  <Bookshelf
    :items="items"
    @contextmenu.prevent.stop="openContextMenu($event)"
  ></Bookshelf>
  <BookshelfModalContainer></BookshelfModalContainer>
  <ContextMenu v-model:show="showContextMenu" :position="contextMenuPosition">
    <div class="context-menu-item">Create Folder</div>
  </ContextMenu>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bookshelf from "../components/Bookshelf.vue";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import ContextMenu, { Position } from "../components/ContextMenu.vue";
import { mapGetters } from "vuex";
import { GET_BOOKMARK_TREE } from "../store";

export default defineComponent({
  components: {
    Bookshelf,
    BookshelfModalContainer,
    ContextMenu,
  },
  data: () => ({
    contextMenuPosition: { x: 0, y: 0 } as Position,
    showContextMenu: false,
  }),
  computed: {
    ...mapGetters({ items: GET_BOOKMARK_TREE }),
  },
  methods: {
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
    },
    openContextMenu(event: PointerEvent) {
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
      this.showContextMenu = true;
    },
  },
});
</script>

<style lang="scss" scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  width: 500px;
  height: 500px;
}

.modal-inner {
  border: 1px solid lightgray;
}

.modal-banner {
  display: flex;
  justify-content: space-between;
}

.context-menu-item {
  padding: 4px 8px;
  &:hover {
    background-color: rgba(54, 69, 79, 0.2);
    cursor: pointer;
  }
}
</style>
