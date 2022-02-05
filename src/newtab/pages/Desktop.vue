<template>
  <Bookshelf :folderItem="bookmarkTreeRoot"></Bookshelf>
  <CreateModal></CreateModal>
  <BookshelfModalContainer></BookshelfModalContainer>
  <ContextMenu />
  <UpdateModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bookshelf from "../components/Bookshelf.vue";
import { mapGetters, mapMutations } from "vuex";
import UpdateModal from "../components/UpdateModal.vue";
import { GET_BOOKMARK_TREE_CHILDREN, GET_BOOKMARK_TREE_ROOT } from "../store";
import CreateModal from "../components/CreateModal.vue";
import { SET_BOOKMARK_CREATE_INFO } from "../store/modules/createModal";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import ContextMenu from "../components/ContextMenu/ContextMenu.vue";

export default defineComponent({
  components: {
    Bookshelf,
    CreateModal,
    BookshelfModalContainer,
    ContextMenu,
    UpdateModal,
  },
  data: () => ({
    maxZIndex: 1000,
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
    openCreateModal() {
      this.setCreateModalInfo({ parentId: this.bookmarkTreeRoot.id });
      this.$vfm.show("createModal");
    },
    ...mapMutations({
      setCreateModalInfo: `createModalModule/${SET_BOOKMARK_CREATE_INFO}`,
    }),
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
</style>
