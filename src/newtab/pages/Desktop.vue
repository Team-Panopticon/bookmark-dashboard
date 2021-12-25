<template>
  <Bookshelf
    @openModal="openModal"
    @openFolder="openFolder"
    :items="items"
  ></Bookshelf>
  <Modal
    @closeModal="closeModal"
    @openFolder="openFolder"
    :showModal="showModal"
    :items="children"
    :folderTitle="folderTitle"
  ></Modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";
import Modal from "../components/Modal.vue";

export default defineComponent({
  components: { Bookshelf, Modal },
  data: () => ({
    showModal: false,
    children: [] as Item[],
    folderTitle: "",
  }),
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
  methods: {
    openModal(title: string, children: Item[]) {
      this.folderTitle = title;
      this.children = children;
      this.showModal = true;
    },
    openFolder(title: string, children: Item[]) {
      this.folderTitle = title;
      this.children = children;
    },
    closeModal() {
      this.showModal = false;
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
