<template>
  <vue-final-modal
    v-model="_showBookshelfModal"
    classes="modal-container"
    content-class="modal-content"
    overlay-class="modal-overlay"
    :drag="true"
    :resize="true"
    :max-height="700"
    :max-width="700"
    :hide-overlay="true"
    :click-to-close="false"
    :esc-to-close="false"
    :prevent-click="true"
    :z-index="zIndex"
  >
    <v-card class="modal-inner" outlined title elevation="7">
      <v-card-header class="modal-banner bg-primary">
        <div class="modal__title d-flex">
          <button v-if="showBackward" class="modal__backward" @click="backward">
            <v-icon>mdi-keyboard-backspace</v-icon>
          </button>
          <v-breadcrumbs :items="folderRoute"></v-breadcrumbs>
        </div>
        <button class="modal__close" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <Bookshelf @openFolder="openFolder" :items="viewItem"> </Bookshelf>
    </v-card>
  </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item } from "../../shared/types/store";
import Bookshelf from "./Bookshelf.vue";

export default defineComponent({
  components: { Bookshelf },
  data() {
    return {
      children: [] as Item[],
      folderRoute: [] as string[],
      items: [] as Item[][],
    };
  },
  props: {
    initItems: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    initTitle: {
      type: String,
      required: true,
    },
    showBookshelfModal: {
      required: true,
      type: Boolean,
    },
    zIndex: {
      required: true,
      type: Number,
    },
  },
  created() {
    this.items.push(this.initItems);
    this.folderRoute.push(this.initTitle);
  },
  computed: {
    showBackward() {
      return this.folderRoute.length > 1;
    },
    viewItem() {
      return this.items[this.items.length - 1];
    },
    _showBookshelfModal() {
      return this.showBookshelfModal;
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeBookshelfModal");
    },

    openFolder(title: string, children: Item[]) {
      this.items.push(children);

      this.addRoute(title);
    },
    addRoute(title: string) {
      this.folderRoute.push(title);
    },
    backward() {
      this.folderRoute.pop();
      this.items.pop();
    },
  },
});
</script>

<style lang="scss" scoped>
.vfm::v-deep {
  .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    position: relative;
    width: 500px;
    height: 500px;
  }
}
.modal-banner {
  display: flex;
  justify-content: space-between;
}
</style>
