<template>
  <div
    class="grid-container"
    @contextmenu.prevent.stop="
      openContextMenu($event, { item: folderItem, type: 'BACKGROUND' })
    "
    :data-parent-id="id"
  >
    <div
      v-for="item in folderItem.children"
      v-bind:key="item.id"
      :data-index="item.index"
    >
      <v-btn
        class="btn"
        tile
        elevation="0"
        v-if="item.children"
        @click="onClickFolder(item)"
        @mouseover="openTooltip(item.title, $event)"
        @mouseleave="closeTooltip()"
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
        @click="openUrl(item.id, item.url)"
        @mouseover="openTooltip(item.title, $event)"
        @mouseleave="closeTooltip()"
        @contextmenu.prevent.stop="
          openContextMenu($event, { item: item, type: 'FILE' })
        "
        :data-index="item.index"
      >
        <div class="item-container">
          <Favicon :url="item.url" />
          <p class="item-title">
            {{ item.title }}
          </p>
        </div>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Favicon from "./Favicon.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
import { Item } from "../../shared/types/store";
import { OPEN_BOOKSHELF_MODALS } from "../store/modules/bookshelfModal";
import { OPEN_BOOKMARK_UPDATE } from "../store/modules/updateModal";
import store, { GET_REFRESH_TARGET, SET_REFRESH_TARGET } from "../store/index";
import { openContextMenu } from "../utils/contextMenu";
import BookmarkApi from "../utils/bookmarkApi";
import {
  SET_TOOLTIP_POSITION,
  SET_TOOLTIP_SHOW,
  SET_TOOLTIP_TEXT,
} from "../store/modules/tooltip";

export default defineComponent({
  components: { Favicon },
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
  computed: {
    ...mapGetters({ refreshTargetId: GET_REFRESH_TARGET }),
  },
  watch: {
    refreshTargetId(id?: string) {
      if (id && this.$props.id === id) {
        this.refresh();
        store.commit(SET_REFRESH_TARGET, "");
      }
    },
  },
  async mounted() {
    this.refresh();
  },
  methods: {
    ...mapMutations([
      OPEN_BOOKSHELF_MODALS,
      SET_TOOLTIP_POSITION,
      SET_TOOLTIP_TEXT,
      SET_TOOLTIP_SHOW,
    ]),
    ...mapActions([OPEN_BOOKMARK_UPDATE]), // updateMODAL
    openBookmarkModal() {
      // TODO: 네이밍 변경(ex. updateModal)
      this[OPEN_BOOKMARK_UPDATE](this.folderItem);
    },
    onClickFolder(item: Item) {
      const { id, title } = item;
      // const isRootItem = this.id === "1";
      if (this.isDesktop) {
        this._openBookshelfModal(id, title);
      } else {
        this.routeInFolder(id);
      }
      this[SET_TOOLTIP_SHOW](false);
    },
    routeInFolder(id: string) {
      this.$emit("routeInFolder", id);
    },
    _openBookshelfModal(id: string, title: string) {
      this.openBookshelfModal({ id, title });
    },
    openUrl(id: string, url: string) {
      window.open(url, "_blank")?.focus();
      this[SET_TOOLTIP_SHOW](false);
    },
    openContextMenu,
    async refresh() {
      this.folderItem = await BookmarkApi.getSubTree(this.id);
    },
    openTooltip(title: string, event: MouseEvent) {
      const targetElement = event.target as HTMLElement;
      const buttonElement = targetElement.closest("button");
      if (!buttonElement) return;

      const boundingRect = buttonElement.getBoundingClientRect();
      const position = {
        x: boundingRect.x,
        y: boundingRect.y + boundingRect.height,
      };

      this[SET_TOOLTIP_POSITION](position);
      this[SET_TOOLTIP_TEXT](title);
      this[SET_TOOLTIP_SHOW](true);
    },
    closeTooltip() {
      this[SET_TOOLTIP_SHOW](false);
    },
  },
});
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, auto));
  grid-auto-rows: 100px;
  padding: 20px;
  gap: 16px;
  width: 100%;
  height: 100%;
}

.btn {
  width: 80px;
  height: auto;
  padding: 4px 0;
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
  text-transform: none;
}
</style>
