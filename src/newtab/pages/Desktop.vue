<template>
  <Bookshelf @openFolder="openFolder" :item="item"></Bookshelf>
  <vue-final-modal
    v-model="showModal"
    classes="modal-container"
    content-class="modal-content"
    overlay-class="modal-overlay"
    :drag="true"
    :resize="true"
    :max-height="700"
    :max-width="700"
    :hide-overlay="true"
    :click-to-close="false"
    :esc-to-close="true"
    :prevent-click="true"
  >
    <v-card class="modal-inner" outlined title elevation="7">
      <v-card-header class="modal-banner bg-primary">
        <span class="modal__title">
          <v-breadcrumbs :items="[folderTitle, '']"></v-breadcrumbs>
        </span>
        <button class="modal__close" @click="showModal = false">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <Bookshelf @openFolder="openFolder" :item="children"> </Bookshelf>
    </v-card>
  </vue-final-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item, Items } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";

export default defineComponent({
  components: { Bookshelf },
  data: () => ({
    showModal: false,
    children: [] as Items,
    folderTitle: "",
  }),
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  methods: {
    openFolder(title: string, children: Items) {
      this.folderTitle = title;
      this.children = children;
      this.showModal = true;
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
