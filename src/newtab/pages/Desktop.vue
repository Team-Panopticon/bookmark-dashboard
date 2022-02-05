<template>
  <Bookshelf
    @openBookshelfModal="openBookshelfModal"
    :folderItem="bookmarkTreeRoot"
    @contextmenu.prevent.stop="openContextMenu($event)"
  ></Bookshelf>
  <CreateModal></CreateModal>
  <BookshelfModalContainer></BookshelfModalContainer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bookshelf from "../components/Bookshelf.vue";
import { mapGetters, mapMutations } from "vuex";
import { GET_BOOKMARK_TREE_CHILDREN, GET_BOOKMARK_TREE_ROOT } from "../store";
import CreateModal from "../components/CreateModal.vue";
import { SET_BOOKMARK_CREATE_INFO } from "../store/modules/createModal";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import { Position } from "../components/ContextMenu.vue";

export default defineComponent({
  components: { Bookshelf, CreateModal, BookshelfModalContainer },
  data: () => ({
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
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
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
