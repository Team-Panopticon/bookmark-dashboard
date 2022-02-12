<template>
  <vue-final-modal
    v-model="showBookshelfModal"
    classes="modal-container"
    content-class="modal-content"
    overlay-class="modal-overlay"
    :min-height="300"
    :drag="true"
    drag-selector=".modal-banner"
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
      @mousedown.capture="focusBookshelfModal(bookshelfModalId)"
    >
      <v-card-header class="modal-banner bg-primary">
        <div class="modal__title d-flex">
          <button v-if="showBackward" class="modal__backward" @click="backward">
            <v-icon>mdi-keyboard-backspace</v-icon>
          </button>
          <v-breadcrumbs :items="folderRoute"></v-breadcrumbs>
        </div>
        <button
          class="modal__close"
          @click="closeBookshelfModal(bookshelfModalId)"
        >
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <Bookshelf
        v-if="viewItem.id"
        :key="viewItem.id"
        @routeInFolder="routeInFolder"
        :id="viewItem.id"
        :title="viewItem.title"
      ></Bookshelf>
    </v-card>
  </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import { FolderItem } from "../../shared/types/store";
import {
  CLOSE_BOOKSHELF_MODALS,
  FOCUS_BOOKSHELF_MODALS,
} from "../store/modules/bookshelfModal";
import Bookshelf from "./Bookshelf.vue";
import BookmarkApi from "../utils/bookmarkApi";
interface BreadCrumb {
  disabled: boolean;
  text: string | number;
}

export default defineComponent({
  components: { Bookshelf },
  props: {
    bookshelfModalId: {
      type: String,
      required: true,
    },
    id: {
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
      showBookshelfModal: true,
      folderItems: [] as FolderItem[],
    };
  },
  computed: {
    showBackward() {
      return this.viewItem.id !== "1";
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
    viewItem() {
      return this.folderItems[this.folderItems.length - 1];
    },
  },

  created() {
    this.routeInFolder(this.id);
  },
  methods: {
    ...mapMutations([CLOSE_BOOKSHELF_MODALS, FOCUS_BOOKSHELF_MODALS]),
    async routeInFolder(id: string) {
      this.folderItems.push({ id, title: "" });
      await this.routePahtRefresh();
    },
    async backward() {
      this.folderItems.pop();
      if (this.folderItems.length == 0) {
        this.folderItems.push({ id: "1", title: "" });
      }
      await this.routePahtRefresh();
    },
    async routePahtRefresh() {
      const ids = this.folderItems.map((item) => {
        return item.id;
      });
      if (ids.length > 0) this.folderItems = await BookmarkApi.get(ids);
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
