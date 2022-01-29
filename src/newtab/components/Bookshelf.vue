<template>
  <div class="grid-container">
    <div
      v-for="(item, i) in items"
      v-bind:key="i"
      @contextmenu.prevent.stop="openContextMenu($event)"
    >
      <v-btn
        class="btn"
        tile
        elevation="0"
        @dblclick="open(item)"
        v-if="item.children"
      >
        <div class="item-container">
          <v-icon class="item-icon">mdi-folder</v-icon>
          <p class="item-title">
            {{ item.title }}
          </p>
        </div>
      </v-btn>

      <v-btn
        v-else
        class="btn"
        tile
        elevation="0"
        @dblclick="openUrl(item.id, item.url)"
      >
        <div class="item-container">
          <Favicon :url="item.url" />
          <p class="item-title">
            {{ item.title }}
          </p>
        </div>
      </v-btn>
    </div>
    <ContextMenu v-model:show="showContextMenu" :position="contextMenuPosition">
      <div class="context-menu-item">Edit</div>
      <div class="context-menu-item">Delete</div>
    </ContextMenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapMutations } from "vuex";
import { Item } from "../../shared/types/store";
import { OPEN_BOOKSHELF_MODALS } from "../store/modules/bookshelfModal";
import ContextMenu, { Position } from "./ContextMenu.vue";
import Favicon from "./Favicon.vue";

export default defineComponent({
  components: { ContextMenu, Favicon },
  data: () => ({
    showContextMenu: false,
    contextMenuPosition: { x: 0, y: 0 } as Position,
  }),
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
  methods: {
    ...mapMutations([OPEN_BOOKSHELF_MODALS]),
    open(item: Item) {
      const { id, title, children = [], parentId } = item;
      const isRootItem = parentId === "1";
      if (isRootItem) {
        this._openBookshelfModal(title, children, id);
      } else {
        this.openFolder(title, children);
      }
    },
    openFolder(title: string, children: Item[]) {
      this.$emit("openFolder", title, children);
    },
    _openBookshelfModal(title: string, children: Item[], id: string) {
      this.openBookshelfModal({ title, children, id });
    },
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
    },
    openContextMenu(event: PointerEvent) {
      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
      this.showContextMenu = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-auto-rows: 100px;
  padding: 20px;
  gap: 16px;
  width: 100%;
  height: 100%;
}

.btn {
  width: 80px;
  height: auto;
  padding: 0;
}
.btn:focus {
  background-color: rgb(225, 225, 225);
}

.item-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.item-icon {
  font-size: 50px;
  color: #36454f;
}

.item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  line-height: 1.2em;
  height: 2.4em;
  word-break: break-all;
  letter-spacing: 0.5px;
  color: #36454f;
}

.context-menu-item {
  padding: 4px 8px;
  &:hover {
    background-color: rgba(54, 69, 79, 0.2);
    cursor: pointer;
  }
}
</style>
