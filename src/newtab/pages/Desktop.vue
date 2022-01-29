<template>
  <Bookshelf
    @openBookshelfModal="openBookshelfModal"
    :items="items"
    @contextmenu.prevent.stop="
      openContextMenu($event, { id: '1', type: 'BACKGROUND' })
    "
  ></Bookshelf>
  <BookshelfModal
    v-for="(
      { targetId, title, children, showBookshelfModal, zIndex }, i
    ) in modals"
    :key="i"
    @mousedown.capture="focusModal(i)"
    @closeBookshelfModal="closeBookshelfModal($event, i)"
    :targetId="targetId"
    :initItems="children"
    :initTitle="title"
    :showBookshelfModal="showBookshelfModal"
    :zIndex="zIndex"
  ></BookshelfModal>
  <ContextMenu />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Item, modalInfo } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";
import BookshelfModal from "../components/BookshelfModal.vue";
import ContextMenu from "../components/ContextMenu/ContextMenu.vue";
import { mapGetters } from "vuex";
import { GET_BOOKMARK_TREE } from "../store";
import { openContextMenu } from "../utils/contextMenu";

const OFFSET = 2;

export default defineComponent({
  components: { Bookshelf, BookshelfModal, ContextMenu },
  data: () => ({
    modals: [] as modalInfo[],
    maxZIndex: 1000,
    showContextMenu: false,
  }),
  computed: {
    ...mapGetters({ items: GET_BOOKMARK_TREE }),
  },
  methods: {
    openBookshelfModal(targetId: string, title: string, children: Item[]) {
      this.modals.push({
        targetId,
        children,
        title,
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
    openContextMenu,
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
