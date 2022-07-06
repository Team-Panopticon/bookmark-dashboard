<template>
  <div
    class="grid-container"
    ref="originGridContainer"
    @contextmenu.prevent.stop="
      openContextMenu($event, { item: folderItem, type: 'BACKGROUND' })
    "
    :data-parent-id="id"
    :data-timestamp="Date.now()"
  >
    <div
      v-for="item in folderItem.children"
      v-bind:key="item.id"
      class="btn-wrapper"
      :style="
        item.row && item.col ? { gridRow: item.row, gridColumn: item.col } : {}
      "
      :data-item-id="item.id"
      :data-id="item.id"
      :data-type="item.type"
      :data-row="item.row"
      :data-col="item.col"
      :ref="setItemRef"
      @mousedown.left="mousedownHandler(item, $event)"
    >
      <v-btn
        class="btn"
        elevation="0"
        v-if="item.children"
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
        plain
        elevation="0"
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
import { defineComponent, PropType, ref } from "vue";
import Favicon from "./Favicon.vue";
import { setupBookshelfAction } from "./composition/setupBookshelfAction";
import { setupBookshelfLayout } from "./composition/setupBookshelfLayout";
import { setupDragAndDrop } from "./composition/setupDragAndDrop";
import { FolderItem, Item } from "@/shared/types/store";
import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "../utils/constant";

/**
 * @TODO
 * <template>data-item-id data-id 중복 삭제
 */

export default defineComponent({
  components: { Favicon },
  props: {
    id: {
      type: String,
      required: true,
    },
    folderItems: {
      type: Array as PropType<FolderItem[]>,
      requiered: false,
    },
  },
  setup(props, context) {
    const folderItem = ref({} as Item);

    const {
      openTooltip,
      closeTooltip,
      openUrl,
      openContextMenu,
      onClickFolder,
    } = setupBookshelfAction({ folderItem, context });

    const { setItemRef } = setupBookshelfLayout({
      id: props.id,
      folderItem,
    });

    const { mousedownHandler, originGridContainer } = setupDragAndDrop({
      openUrl,
      onClickFolder,
    });

    return {
      folderItem,
      openTooltip,
      closeTooltip,
      openUrl,
      openContextMenu,
      onClickFolder,
      setItemRef,
      mousedownHandler,
      originGridContainer,
    };
  },
  data() {
    return {
      gridContainerPadding: `${GRID_CONTAINER_PADDING}px`,
      itemHeight: `${ITEM_HEIGHT}px`,
      itemWidth: `${ITEM_WIDTH}px`,
    };
  },
});
</script>

<style lang="scss" scoped>
.divider {
  position: absolute;
  border-left: 2px solid grey;
}

.hide {
  border: none;
}

.positionHolderEl-component {
  opacity: 0.5;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, v-bind("itemWidth"));
  grid-auto-rows: v-bind("itemHeight");
  padding: v-bind("gridContainerPadding");
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
}
.btn-wrapper {
  display: flex;
  justify-content: center;
  background: none;
  border: 1px solid red;
}
.btn {
  width: v-bind("itemWidth");
  height: auto;
  padding: 8px;
  /* padding: 4px 0; */
  background: none;
}

.btn:focus {
  background-color: rgba(225, 225, 225, 0.3);
}

.item {
  width: v-bind("itemWidth");
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
