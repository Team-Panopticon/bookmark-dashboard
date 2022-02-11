<template>
  <Bookshelf :folderItem="bookmarkTreeRoot"></Bookshelf>
  <CreateFolderModal></CreateFolderModal>
  <BookshelfModalContainer></BookshelfModalContainer>
  <ContextMenu />
  <UpdateModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bookshelf from "../components/Bookshelf.vue";
import { mapGetters } from "vuex";
import UpdateModal from "../components/UpdateModal.vue";
import { GET_BOOKMARK_TREE_ROOT } from "../store";
import CreateFolderModal from "../components/CreateFolderModal.vue";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import ContextMenu from "../components/ContextMenu/ContextMenu.vue";

export default defineComponent({
  components: {
    Bookshelf,
    CreateFolderModal,
    BookshelfModalContainer,
    ContextMenu,
    UpdateModal,
  },
  computed: {
    ...mapGetters({
      bookmarkTreeRoot: GET_BOOKMARK_TREE_ROOT,
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
