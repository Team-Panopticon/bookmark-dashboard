<template>
  <Bookshelf @openModal="openModal" :items="items"></Bookshelf>
  <component
    v-for="({ component, title, children, showModal }, i) in modals"
    :key="i"
    :is="component"
    @closeModal="closeModal($event, i)"
    :initItems="children"
    :initTitle="title"
    :showModal="showModal"
  ></component>
  <!-- <Modal
    @closeModal="closeModal"
    @openFolder="openFolder"
    @backward="backward"
    :showModal="showModal"
    :items="children"
    :folderTitle="folderTitle"
  ></Modal> -->
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item, modalInfo } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";
import Modal from "../components/Modal.vue";

export default defineComponent({
  components: { Bookshelf, Modal },
  data: () => ({
    modals: [] as modalInfo[],
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
        component: "Modal",
        title: title,
        showModal: true,
      });
    },
    closeModal(_: null, idx: number) {
      this.modals[idx].showModal = false;
    },
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
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
