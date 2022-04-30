<template>
  <div
    class="grid-container"
    @contextmenu.prevent.stop="
      openContextMenu($event, { item: folderItem, type: 'BACKGROUND' })
    "
  >
    <div v-for="item in folderItem.children" v-bind:key="item.id">
      <v-btn
        class="btn"
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
import Favicon from "../Favicon.vue";
import { setupBookshelf } from "../composition/setupBookshelf";
import { Item } from "@/shared/types/store";
import store from "../../store/index";
import { SET_TOOLTIP_SHOW } from "@/newtab/store/modules/tooltip";

export default defineComponent({
  components: { Favicon },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { folderItem, openTooltip, closeTooltip, openUrl, openContextMenu } =
      setupBookshelf(props);
    return {
      folderItem,
      openTooltip,
      closeTooltip,
      openUrl,
      openContextMenu,
    };
  },
  methods: {
    onClickFolder(item: Item) {
      const { id } = item;
      this.$emit("routeInFolder", id);
      store.commit(SET_TOOLTIP_SHOW, false);
    },
  },
});
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 88px);
  grid-auto-rows: 108px;
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow-y: "auto";
}

.btn {
  width: 88px;
  height: auto;
  padding: 8px;
}
.btn:focus {
  background-color: rgb(225, 225, 225);
}

.item {
  width: 88px;
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
  white-space: normal;
}
</style>
