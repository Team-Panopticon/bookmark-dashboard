<template>
  <div class="app-container" :class="{ darkMode }">
    <Bookshelf id="1"></Bookshelf>
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
import store from "../store";
import CreateFolderModal from "../components/CreateFolderModal.vue";
import BookshelfModalContainer from "../components/BookshelfModalContainer.vue";
import ContextMenuContainer from "../components/ContextMenu/ContextMenuContainer.vue";
import { Item } from "@/shared/types/store";
import Tooltip from "../components/Tooltip.vue";
import { UPDATE_REFRESH_TIMES } from "../store/modules/refreshTarget";

import { GET_CONFIG_MODE } from "../store/modules/config";
import { mapGetters } from "vuex";
export default defineComponent({
  components: {
    Bookshelf,
    CreateFolderModal,
    BookshelfModalContainer,
    ContextMenuContainer,
    UpdateModal,
    Tooltip,
  },
  computed: {
    ...mapGetters([GET_CONFIG_MODE]),
    darkMode: {
      get(): boolean {
        return this[GET_CONFIG_MODE] === "DARK";
      },
      set() {
        return;
      },
    },
  },
  mounted() {
    setBookmarksEventHandlers();
  },
});

function setBookmarksEventHandlers() {
  chrome.bookmarks.onCreated.addListener((id: string, bookmark: Item) => {
    const { parentId } = bookmark;
    store.commit(UPDATE_REFRESH_TIMES, [parentId]);
  });
  chrome.bookmarks.onRemoved.addListener(
    (id: string, removeInfo: chrome.bookmarks.BookmarkRemoveInfo) => {
      const { parentId } = removeInfo;
      store.commit(UPDATE_REFRESH_TIMES, [parentId]);
    }
  );
  chrome.bookmarks.onMoved.addListener(
    (id: string, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => {
      const { parentId, oldParentId } = moveInfo;
      store.commit(UPDATE_REFRESH_TIMES, [parentId, oldParentId]);
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
  border-radius: 4px 4px 0 0;
}
.app-container {
  width: 100%;
  height: 100%;
}
.darkMode {
  background: #202124;
  color: white;
}
::v-deep .v-text-field input {
  color: black;
}
</style>
