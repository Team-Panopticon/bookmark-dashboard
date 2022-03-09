<template>
  <div class="app-container">
    <Bookshelf id="1" :isDesktop="true"></Bookshelf>
    <CreateFolderModal></CreateFolderModal>
    <BookshelfModalContainer></BookshelfModalContainer>
    <ContextMenuContainer />
    <UpdateModal />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bookshelf from "../components/Bookshelf.vue";
import { mapGetters } from "vuex";
import UpdateModal from "../components/UpdateModal.vue";
import { GET_BOOKMARK_TREE_ROOT } from "../store";
import CreateFolderModal from "../components/CreateFolderModal.vue";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import ContextMenuContainer from "../components/ContextMenu/ContextMenuContainer.vue";

export default defineComponent({
  components: {
    Bookshelf,
    CreateFolderModal,
    BookshelfModalContainer,
    ContextMenuContainer,
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
}
::v-deep .modal-banner {
  display: flex;
  justify-content: space-between;
}
.app-container {
  width: 100%;
  height: 100%;
}
</style>
