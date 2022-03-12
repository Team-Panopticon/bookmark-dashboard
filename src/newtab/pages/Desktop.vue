<template>
  <Bookshelf id="1" :isDesktop="true"></Bookshelf>
  <CreateFolderModal></CreateFolderModal>
  <BookshelfModalContainer></BookshelfModalContainer>
  <ContextMenuContainer />
  <UpdateModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Bookshelf from "../components/Bookshelf.vue";
import { mapGetters } from "vuex";
import UpdateModal from "../components/UpdateModal.vue";
import store, { GET_BOOKMARK_TREE_ROOT, SET_REFRESH_TARGET } from "../store";
import CreateFolderModal from "../components/CreateFolderModal.vue";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import ContextMenuContainer from "../components/ContextMenu/ContextMenuContainer.vue";
import { Item } from "@/shared/types/store";

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
