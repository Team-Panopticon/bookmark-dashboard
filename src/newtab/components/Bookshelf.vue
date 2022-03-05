<template>
  <div
    class="grid-container"
    @contextmenu.prevent.stop="
      openContextMenu($event, { item: folderItem, type: 'BACKGROUND' })
    "
  >
    <div v-for="(item, i) in folderItem.children" v-bind:key="i">
      <Tooltip :text="item.title">
        <v-btn
          class="btn"
          tile
          elevation="0"
          @dblclick="onDblClickFolder(item)"
          v-if="item.children"
          @contextmenu.prevent.stop="
            openContextMenu($event, { item: item, type: 'FOLDER' })
          "
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
          @contextmenu.prevent.stop="
            openContextMenu($event, { item: item, type: 'FILE' })
          "
        >
          <div class="item-container">
            <Favicon :url="item.url" />
            <p class="item-title">
              {{ item.title }}
            </p>
          </div>
        </v-btn>
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import { Item } from "../../shared/types/store";
import { OPEN_BOOKSHELF_MODALS } from "../store/modules/bookshelfModal";
import Favicon from "./Favicon.vue";
import { mapActions } from "vuex";
import { OPEN_BOOKMARK_UPDATE } from "../store/modules/updateModal";
import { openContextMenu } from "../utils/contextMenu";
import BookmarkApi from "../utils/bookmarkApi";
import Tooltip from "../components/Tooltip.vue";

export default defineComponent({
  components: { Favicon, Tooltip },
  props: {
    id: {
      type: String,
      required: true,
    },
    isDesktop: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: () => ({
    folderItem: {} as Item,
  }),
  async mounted() {
    this.refresh();
  },
  methods: {
    ...mapMutations([OPEN_BOOKSHELF_MODALS]),
    ...mapActions([OPEN_BOOKMARK_UPDATE]), // updateMODAL
    openBookmarkModal() {
      // TODO: 네이밍 변경(ex. updateModal)
      this[OPEN_BOOKMARK_UPDATE](this.folderItem);
    },
    onDblClickFolder(item: Item) {
      const { id, title } = item;
      // const isRootItem = this.id === "1";
      if (this.isDesktop) {
        this._openBookshelfModal(id, title);
      } else {
        this.routeInFolder(id);
      }
    },
    routeInFolder(id: string) {
      this.$emit("routeInFolder", id);
    },
    _openBookshelfModal(id: string, title: string) {
      this.openBookshelfModal({ id, title });
    },
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
    },
    openContextMenu,
    async refresh() {
      this.folderItem = await BookmarkApi.getSubTree(this.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, auto));
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
