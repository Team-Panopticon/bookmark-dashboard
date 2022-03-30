<template>
  <div class="app-container">
    <Bookshelf id="1" :isDesktop="true"></Bookshelf>
    <CreateFolderModal></CreateFolderModal>
    <BookshelfModalContainer></BookshelfModalContainer>
    <ContextMenuContainer />
    <UpdateModal />
    <Tooltip />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bookshelf from "../components/Bookshelf.vue";
import UpdateModal from "../components/UpdateModal.vue";
import store, { SET_REFRESH_TARGET } from "../store";
import CreateFolderModal from "../components/CreateFolderModal.vue";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import ContextMenuContainer from "../components/ContextMenu/ContextMenuContainer.vue";
import { Item } from "@/shared/types/store";
import Tooltip from "../components/Tooltip.vue";

export default defineComponent({
  components: {
    Bookshelf,
    CreateFolderModal,
    BookshelfModalContainer,
    ContextMenuContainer,
    UpdateModal,
    Tooltip,
  },
  mounted() {
    setBookmarksEventHandlers();
  },
});

function setBookmarksEventHandlers() {
  chrome.bookmarks.onCreated.addListener((id: string, bookmark: Item) => {
    const { parentId } = bookmark;
    store.commit(SET_REFRESH_TARGET, parentId);
  });
  chrome.bookmarks.onRemoved.addListener(
    (id: string, removeInfo: chrome.bookmarks.BookmarkRemoveInfo) => {
      const { parentId } = removeInfo;
      store.commit(SET_REFRESH_TARGET, parentId);
    }
  );
}
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
::v-deep .v-card-header {
  padding-top: 16px;
  padding-bottom: 16px;
}
.app-container {
  width: 100%;
  height: 100%;
}
</style>
