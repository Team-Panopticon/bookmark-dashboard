<template>
  <Bookshelf @openModal="openModal" :items="items"></Bookshelf>
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
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item, modalInfo } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";
import Modal from "../components/Modal.vue";

const OFFSET = 2;

export default defineComponent({
  components: { Bookshelf, Modal },
  data: () => ({
    modals: [] as modalInfo[],
    maxZIndex: 1000,
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
