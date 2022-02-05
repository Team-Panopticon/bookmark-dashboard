<template>
  <vue-final-modal
    v-model="showBookshelfModal"
    classes="modal-container"
    content-class="modal-content"
    overlay-class="modal-overlay"
    :min-height="300"
    :drag="true"
    :resize="true"
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
      <Bookshelf @openFolder="openFolder" :folderItem="viewItem"></Bookshelf>
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

interface BreadCrumb {
  disabled: boolean;
  text: string | number;
}

export default defineComponent({
  components: { Bookshelf },
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
  data() {
    return {
      // children: [] as Item[],
      // folderRoute: [] as string[],
      // items: [] as Item[][],
      showBookshelfModal: true,
      folderItems: [] as Item[],
    };
  },
  computed: {
    showBackward() {
      return this.folderRoute.length > 1;
    },
    viewItem() {
      return this.folderItems[this.folderItems.length - 1];
    },
    _showBookshelfModal() {
      return this.showBookshelfModal;
    },
    folderRoute(): BreadCrumb[] {
      return this.folderItems.map((item) => ({
        disabled: false,
        text: item.title,
      }));
    },
  },
  created() {
    this.folderItems.push({
      id: this.initId,
      title: this.initTitle,
      children: this.initItems,
    });
  },
  methods: {
    ...mapMutations([CLOSE_BOOKSHELF_MODALS, FOCUS_BOOKSHELF_MODALS]),
    openFolder(folderItem: Item) {
      this.folderItems.push(folderItem);
    },
    backward() {
      this.folderItems.pop();
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
.modal-inner {
  border: 1px solid lightgray;
  width: 100%;
  height: 100%;
}
.modal-banner {
  display: flex;
  justify-content: space-between;
}
</style>
