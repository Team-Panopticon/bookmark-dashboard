<template>
  <Bookshelf
    @openBookshelfModal="openBookshelfModal"
    :folderItem="bookmarkTreeRoot"
    @contextmenu.prevent.stop="openContextMenu($event)"
  ></Bookshelf>
  <BookshelfModal
    v-for="({ folderItem, showBookshelfModal, zIndex }, i) in modals"
    :key="i"
    @mousedown.capture="focusModal(i)"
    @closeBookshelfModal="closeBookshelfModal($event, i)"
    :initFolderItem="folderItem"
    :showBookshelfModal="showBookshelfModal"
    :zIndex="zIndex"
  ></BookshelfModal>
  <CreateModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Item, modalInfo } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";
import BookshelfModal from "../components/BookshelfModal.vue";
import { Position } from "../components/ContextMenu.vue";
import { mapGetters, mapMutations } from "vuex";
import { GET_BOOKMARK_TREE_CHILDREN, GET_BOOKMARK_TREE_ROOT } from "../store";
import CreateModal from "../components/CreateModal.vue";
import { SET_BOOKMARK_CREATE_INFO } from "../store/modules/createModal";

const OFFSET = 2;

export default defineComponent({
  components: { Bookshelf, BookshelfModal, CreateModal },
  data: () => ({
    modals: [] as modalInfo[],
    maxZIndex: 1000,
    contextMenuPosition: { x: 0, y: 0 } as Position,
    showContextMenu: false,
  }),
  computed: {
    ...mapGetters({
      items: GET_BOOKMARK_TREE_CHILDREN,
      bookmarkTreeRoot: GET_BOOKMARK_TREE_ROOT,
    }),
  },
  methods: {
    openBookshelfModal(folderItem: Item) {
      this.modals.push({
        folderItem,
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
      this.setCreateModalInfo({ parentId: this.bookmarkTreeRoot.id });
      this.$vfm.show("createModal");
      this.showContextMenu = false;
    },
    ...mapMutations({
      setCreateModalInfo: `createModalModule/${SET_BOOKMARK_CREATE_INFO}`,
    }),
  },
});
</script>

<style lang="scss" scoped>
.context-menu-item {
  padding: 4px 8px;
  &:hover {
    background-color: rgba(54, 69, 79, 0.2);
    cursor: pointer;
  }
}
</style>
