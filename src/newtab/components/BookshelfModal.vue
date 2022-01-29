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
          <v-breadcrumbs :items="folderRouteTitle"></v-breadcrumbs>
        </div>
        <button class="modal__close" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <Bookshelf
        @openFolder="openFolder"
        @contextmenu.prevent.stop="openContextMenu($event, target)"
        :items="viewItem"
      ></Bookshelf>
    </v-card>
  </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item } from "../../shared/types/store";
import { ContextMenuTarget } from "../store/modules/contextMenu";
import { openContextMenu } from "../utils/contextMenu";
import Bookshelf from "./Bookshelf.vue";

export default defineComponent({
  components: { Bookshelf },
  data() {
    return {
      children: [] as Item[],
      folderRoute: [] as { id: string; title: string }[],
      items: [] as Item[][],
      target: {} as ContextMenuTarget,
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
    targetId: {
      required: true,
      type: String,
    },
  },
  created() {
    this.items.push(this.initItems);
    this.folderRoute.push({ id: this.targetId, title: this.initTitle });
    this.target = {
      id: this.targetId,
      type: "BACKGROUND",
    };
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
    folderRouteTitle() {
      return this.folderRoute.map(({ title }) => title);
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeBookshelfModal");
    },

    openFolder(targetId: string, title: string, children: Item[]) {
      this.items.push(children);
      this.target = { ...this.target, id: targetId };
      this.addRoute({ id: targetId, title });
    },
    addRoute(target: { id: string; title: string }) {
      this.folderRoute.push(target);
    },
    backward() {
      this.folderRoute.pop();
      const prevTarget = this.folderRoute[this.folderRoute.length - 1];
      if (prevTarget) {
        this.target = { id: prevTarget?.id, type: "BACKGROUND" };
      }
      this.items.pop();
    },
    openContextMenu,
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
