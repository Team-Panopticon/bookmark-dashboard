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
import UpdateModal from "../components/UpdateModal.vue";
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
