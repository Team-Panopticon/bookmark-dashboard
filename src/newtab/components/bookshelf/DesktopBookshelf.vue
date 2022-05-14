<template>
  <div
    class="grid-container"
    @contextmenu.prevent.stop="
      openContextMenu($event, { item: folderItem, type: 'BACKGROUND' })
    "
  >
    <div
      v-for="item in folderItem.children"
      v-bind:key="item.id"
      :style="
        item.row && item.col ? { gridRow: item.row, gridColumn: item.col } : {}
      "
      :data-item-id="item.id"
      :ref="setItemRef"
    >
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
import { OPEN_BOOKSHELF_MODALS } from "@/newtab/store/modules/bookshelfModal";
import { Item } from "@/shared/types/store";
import store from "../../store/index";
import { SET_TOOLTIP_SHOW } from "@/newtab/store/modules/tooltip";
import { layoutDB } from "../../utils/layoutDB";

const appendLayoutData = async (folderItem: Item): Promise<Item> => {
  const layOutData = await layoutDB.getLayout();
  folderItem.children?.forEach((item: Item) => {
    const { row, col } = layOutData[item.id] ?? {};
    item.row = row;
    item.col = col;
  });

  return folderItem;
};

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
      setupBookshelf(props, appendLayoutData);

    return {
      folderItem,
      openTooltip,
      closeTooltip,
      openUrl,
      openContextMenu,
    };
  },
  methods: {
    // row, col이 DB에 없는 애들의 row, col을 계산해서 DB에 저장해줌 + 스타일 추가 (위치 고정)
    async setItemRef(elItem: HTMLDivElement) {
      const id = elItem.dataset.itemId as string;
      const itemLayout = await layoutDB.getItemLayoutById(id);

      if (itemLayout) {
        return;
      }

      const itemWidth = elItem.offsetWidth;
      const itemHeight = elItem.offsetHeight;

      // parent 로부터의 offsetLeft로 스스로의 row, column 계산
      // parent가 min-height, min-width가 제대로 지정되어 있어야 offsetLeft가 정확한 값
      const col = Math.floor((elItem.offsetLeft - 20) / itemWidth) + 1;
      const row = Math.floor((elItem.offsetTop - 20) / itemHeight) + 1;

      // row column을 DB에 삽입
      // console.log("saving initial position to DB", id, row, col);
      layoutDB.setItemLayoutById({ id, row, col });

      // 저장된 초기 row, col 값을 folderItem에 반영
      // TODO
    },
    onClickFolder(item: Item) {
      const { id, title } = item;
      store.commit(OPEN_BOOKSHELF_MODALS, { id, title });
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
