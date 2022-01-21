<template>
  <Bookshelf
    @openBookshelfModal="openBookshelfModal"
    :items="items"
    @contextmenu.prevent.stop="openContextMenu($event)"
  ></Bookshelf>
  <BookshelfModal
    v-for="({ title, children, showBookshelfModal, zIndex }, i) in modals"
    :key="i"
    @mousedown.capture="focusModal(i)"
    @closeBookshelfModal="closeBookshelfModal($event, i)"
    :initItems="children"
    :initTitle="title"
    :showBookshelfModal="showBookshelfModal"
    :zIndex="zIndex"
  ></BookshelfModal>
  <ContextMenu v-model:show="showContextMenu" :position="contextMenuPosition">
    <div class="context-menu-item" @click="openCreateModal">Create Folder</div>
  </ContextMenu>
  <CreateModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Item, modalInfo } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";
import BookshelfModal from "../components/BookshelfModal.vue";
import ContextMenu, { Position } from "../components/ContextMenu.vue";
import { mapGetters } from "vuex";
import { GET_BOOKMARK_TREE } from "../store";
import CreateModal from "../components/CreateModal.vue";

const OFFSET = 2;

export default defineComponent({
  components: { Bookshelf, BookshelfModal, ContextMenu, CreateModal },
  data: () => ({
    modals: [] as modalInfo[],
    maxZIndex: 1000,
    contextMenuPosition: { x: 0, y: 0 } as Position,
    showContextMenu: false,
  }),
  computed: {
    ...mapGetters({ items: GET_BOOKMARK_TREE }),
  },
  methods: {
    openBookshelfModal(title: string, children: Item[]) {
      this.modals.push({
        children: children,
        title: title,
        showBookshelfModal: true,
        zIndex: (this.maxZIndex += OFFSET),
      });
    },
    closeBookshelfModal(_: null, idx: number) {
      this.modals[idx].showBookshelfModal = false;
    },
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
    },
    focusModal(idx: number) {
      this.modals[idx].zIndex = this.maxZIndex += OFFSET;
    },
    openContextMenu(event: PointerEvent) {
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
      this.showContextMenu = true;
    },
    openCreateModal() {
      this.$vfm.show("createModal");
      this.showContextMenu = false;
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
