<template>
  <div ref="vfmContainerRef">
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
        @mousedown.capture="focusBookshelfModal(timeStampId)"
      >
        <v-card-header class="modal-banner bg-primary">
          <div class="modal__title d-flex">
            <button
              v-if="showBackward"
              class="modal__backward"
              @click="backward"
            >
              <v-icon>mdi-keyboard-backspace</v-icon>
            </button>
            <v-breadcrumbs :items="folderRoute"></v-breadcrumbs>
          </div>
          <button
            class="modal__close"
            @click="closeBookshelfModal(timeStampId)"
          >
            <v-icon>mdi-close</v-icon>
          </button>
        </v-card-header>

        <div class="v-card-content">
          <Bookshelf
            v-if="viewItem.id"
            :key="viewItem.id"
            @routeInFolder="routeInFolder"
            :id="viewItem.id"
          ></Bookshelf>
        </div>
      </v-card>
    </vue-final-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import { FolderItem } from "../../shared/types/store";
import {
  CLOSE_BOOKSHELF_MODALS,
  FOCUS_BOOKSHELF_MODALS,
  GET_BOOKSHELF_MODALS_CURRENT_POSITION,
  UPDATE_BOOKSHELF_MODALS_CURRENT_POSITION,
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
    timeStampId: {
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
      position: { top: 0, right: 0 },
      folderItems: [] as FolderItem[],
    };
  },
  computed: {
    ...mapGetters({ nextPosition: GET_BOOKSHELF_MODALS_CURRENT_POSITION }),
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
  mounted() {
    const vfmContainer = this.$refs.vfmContainerRef as HTMLDivElement;
    const elVfmContainer = vfmContainer.querySelector(
      ".modal-content"
    ) as HTMLDivElement;
    if (elVfmContainer) {
      this.$nextTick(() => {
        const { offsetHeight, offsetWidth } = elVfmContainer;
        const { top, right } = this.nextPosition(offsetHeight, offsetWidth);
        this.position = { top, right };
        elVfmContainer.style.position = "absolute";
        elVfmContainer.style.top = `${top}px`;
        elVfmContainer.style.left = `${right}px`;
      });
    }
    elVfmContainer.addEventListener("mouseup", this.updatePosition);
  },
  beforeUnmount() {
    const vfmContainer = this.$refs.vfmContainerRef as HTMLDivElement;
    const elVfmContainer = vfmContainer.querySelector(
      ".modal-content"
    ) as HTMLDivElement;
    elVfmContainer.removeEventListener("mouseup", this.updatePosition);
  },
  methods: {
    ...mapMutations([
      CLOSE_BOOKSHELF_MODALS,
      FOCUS_BOOKSHELF_MODALS,
      UPDATE_BOOKSHELF_MODALS_CURRENT_POSITION,
    ]),
    async routeInFolder(id: string) {
      this.folderItems.push({ id, title: "" });
      await this.routePathRefresh();
    },
    async backward() {
      this.folderItems.pop();
      if (this.folderItems.length == 0) {
        this.folderItems.push({ id: "1", title: "" });
      }
      await this.routePathRefresh();
    },
    async routePathRefresh() {
      const ids = this.folderItems.map((item) => {
        return item.id;
      });
      if (ids.length > 0) this.folderItems = await BookmarkApi.get(ids);
    },
    updatePosition() {
      const vfmContainer = this.$refs.vfmContainerRef as HTMLDivElement;
      const elVfmContainer = vfmContainer.querySelector(
        ".modal-content"
      ) as HTMLDivElement;

      const { top, left: right } = elVfmContainer.getBoundingClientRect();
      if (this.position.top !== top && this.position.right !== right) {
        // Element의 left을 css의 right 속성에 적용해야 실제 Element left 위치가 적용됨
        this.updateBookshelfModalsCurrentPosition({ top, right });
        this.position = { top, right };
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.vfm::v-deep {
  .modal-content {
    // position: relative;
    width: 500px;
    height: 500px;
  }
}
.modal-inner {
  border: 1px solid lightgray;
  width: 100%;
  height: 100%;
}
.v-card {
  display: flex;
  flex-direction: column;
}
.v-card-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}
.v-breadcrumbs {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
