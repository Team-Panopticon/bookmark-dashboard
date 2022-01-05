<template>
  <Bookshelf
    @openModal="openModal"
    :items="items"
    @click="closeContextMenu()"
    @contextmenu.prevent="openContextMenu($event)"
  ></Bookshelf>
  <Modal
    v-for="({ title, children, showModal, zIndex }, i) in modals"
    :key="i"
    @mousedown.capture="focusModal(i)"
    @closeModal="closeModal($event, i)"
    :initItems="children"
    :initTitle="title"
    :showModal="showModal"
    :zIndex="zIndex"
  ></Modal>
  <ContextMenu :show="showContextMenu" :position="contextMenuPosition">
    <div>Create Folder</div>
  </ContextMenu>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item, modalInfo } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";
import Modal from "../components/Modal.vue";
import ContextMenu from "../components/ContextMenu.vue";
import "v-contextmenu/dist/themes/default.css";

const OFFSET = 2;

interface Position {
  x: number;
  y: number;
}

export default defineComponent({
  components: { Bookshelf, Modal, ContextMenu },
  data: () => ({
    modals: [] as modalInfo[],
    maxZIndex: 1000,
    contextMenuPosition: { x: 0, y: 0 } as Position,
    showContextMenu: false,
  }),
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
  methods: {
    openModal(title: string, children: Item[]) {
      this.modals.push({
        children: children,
        title: title,
        showModal: true,
        zIndex: (this.maxZIndex += OFFSET),
      });
    },
    closeModal(_: null, idx: number) {
      this.modals[idx].showModal = false;
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
    closeContextMenu() {
      this.showContextMenu = false;
    },
  },
});
</script>

<style scoped>
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
