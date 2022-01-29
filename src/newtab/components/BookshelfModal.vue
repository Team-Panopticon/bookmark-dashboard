<template>
  <vue-final-modal
    v-model="showBookshelfModal"
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
    <v-card
      class="modal-inner"
      outlined
      title
      elevation="7"
      @mousedown.capture="focusBookshelfModal(initId)"
    >
      <v-card-header class="modal-banner bg-primary">
        <div class="modal__title d-flex">
          <button v-if="showBackward" class="modal__backward" @click="backward">
            <v-icon>mdi-keyboard-backspace</v-icon>
          </button>
          <v-breadcrumbs :items="folderRoute"></v-breadcrumbs>
        </div>
        <button class="modal__close" @click="closeBookshelfModal(initId)">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <Bookshelf @openFolder="openFolder" :items="viewItem"> </Bookshelf>
    </v-card>
  </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapMutations } from "vuex";
import { Item } from "../../shared/types/store";
import {
  CLOSE_BOOKSHELF_MODALS,
  FOCUS_BOOKSHELF_MODALS,
} from "../store/modules/bookshelfModal";
import Bookshelf from "./Bookshelf.vue";

export default defineComponent({
  components: { Bookshelf },
  data() {
    return {
      children: [] as Item[],
      folderRoute: [] as string[],
      items: [] as Item[][],
      showBookshelfModal: true,
    };
  },
  props: {
    initId: {
      type: String,
      required: true,
    },
    initItems: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    initTitle: {
      type: String,
      required: true,
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
  },
  methods: {
    ...mapMutations([CLOSE_BOOKSHELF_MODALS, FOCUS_BOOKSHELF_MODALS]),
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
