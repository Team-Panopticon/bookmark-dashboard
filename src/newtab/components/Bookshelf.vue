<template>
  <div
    class="grid-container"
    ref="gridContainer"
    @contextmenu.prevent.stop="
      openContextMenu($event, { item: folderItem, type: 'BACKGROUND' })
    "
    :data-parent-id="id"
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
import { defineComponent, ref } from "vue";
import Favicon from "./Favicon.vue";
import { setupBookshelfAction } from "./composition/setupBookshelfAction";
import { setupBookshelfLayout } from "./composition/setupBookshelfLayout";
import { Item } from "@/shared/types/store";
import { GRID_CONTAINER_PADDING } from "../utils/constant";
import BookmarkApi from "../utils/bookmarkApi";

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
    isDesktop: {
      type: Boolean,
      required: false,
      default: false,
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
    const { setItemRef } = setupBookshelfLayout({ id: props.id, folderItem });

    /**
      1. down 했을때 위치
      2. move 시킬때 첫 위치와 move 위치의 크기값이 일정 이하일때는 클릭 이동거리 100 이하 && 0.15초 이내
      3. 클릭
    **/
    const getTestingEl = (x: number, y: number): HTMLElement => {
      let mousePositionEls = document
        .elementsFromPoint(x, y)
        .filter(
          (el) =>
            el.classList.contains("btn-wrapper") &&
            !el.classList.contains("positionHolderEl-component")
        );

      return mousePositionEls[0] as HTMLElement;
    };
    let originRow = -1;
    let originCol = -1;
    let holderRow = -1;
    let holderCol = -1;
    const gridContainer = ref<HTMLElement>();
    const mousedownHandler = async (item: Item, mousedown: MouseEvent) => {
      mousedown.preventDefault();
      const gridContainerEl = gridContainer.value as HTMLElement;
      const startTime = new Date().getTime();
      const { pageX: startX, pageY: startY } = mousedown;

      /** mousedown 이벤트가 일어난 대상 button 자식 태그들이 될 수 있음 */
      const mousedownTarget = mousedown.target as HTMLElement;
      /** 위치가 변경될 폴더 혹은 파일 Element */
      const changingEl = mousedownTarget.closest(".btn-wrapper") as HTMLElement;

      const changingElId = changingEl.dataset.id;

      /** 파일의 기존위치 : 겹쳤을때 되돌리기 용도 */
      originRow = Number(changingEl.dataset.row);
      originCol = Number(changingEl.dataset.col);

      const { x: targetX, y: targetY } = changingEl.getBoundingClientRect();
      const { x: baseX, y: baseY } = gridContainerEl.getBoundingClientRect();
      console.log(gridContainerEl.getBoundingClientRect());
      /** padding 값에 따른 마우스 포인터와 chaningEl의 상대 위치 값 */
      const offsetX = startX - targetX + 20 + 8;
      const offsetY = startY - targetY + 20;

      /** 기존의 자리를 표시해주는 chaingEl 복사본 Element */
      const positionHolderEl = changingEl.cloneNode(true) as HTMLElement;

      positionHolderEl.classList.add("positionHolderEl-component");

      changingEl.classList.remove("btn-wrapper");
      gridContainerEl.insertBefore(positionHolderEl, changingEl);
      changingEl.style.zIndex = "9999";
      changingEl.style.left = `${startX - offsetX}px`;
      changingEl.style.top = `${startY - offsetY}px`;
      changingEl.style.position = "fixed";

      /** 변경될 위치의 기준이 되는 폴더 혹은 파일 Element */
      let testingEl: null | HTMLElement = null;
      let testingElId: undefined | string = undefined;

      const mousemoveHandler = (e: MouseEvent) => {
        e.preventDefault();
        const gridContainerEl = gridContainer.value as HTMLElement;

        const { x: baseX, y: baseY } = gridContainerEl.getBoundingClientRect();
        console.log(gridContainerEl.getBoundingClientRect());
        if (new Date().getTime() - startTime < 150) {
          return;
        }
        changingEl.style.left = `${e.pageX - offsetX}px`;
        changingEl.style.top = `${e.pageY - offsetY}px`;

        holderRow = Math.floor((e.clientY - baseY - 20) / 100) + 1;
        holderCol = Math.floor((e.clientX - baseX - 20) / 96) + 1;
        positionHolderEl.style.gridColumn = String(holderCol);
        positionHolderEl.style.gridRow = String(holderRow);
        testingEl = getTestingEl(e.pageX, e.pageY);
        testingElId = testingEl?.dataset.id;

        const innerBtn = testingEl?.querySelector(".btn") as HTMLElement;
        // 새로운 버튼위로 올라갔을때

        if (testingEl?.dataset.type === "FOLDER") {
          innerBtn?.focus();
        } else if (testingEl?.dataset.type === "FILE") {
          positionHolderEl.style.gridColumn = String(originCol);
          positionHolderEl.style.gridRow = String(originRow);
        }
      };
      document.addEventListener("mousemove", mousemoveHandler);
      const mouseUpHandler = async (mouseupEvt: MouseEvent) => {
        changingEl.classList.add("btn-wrapper");

        changingEl.style.position = "relative";
        changingEl.style.top = "unset";
        changingEl.style.left = "unset";
        changingEl.style.zIndex = "inherit";
        // TODO : db update => dataset 동기화
        if (
          holderRow > 0 &&
          holderCol > 0 &&
          testingEl?.dataset.type !== "FILE"
        ) {
          changingEl.style.gridRow = String(holderRow);
          changingEl.style.gridColumn = String(holderCol);
          changingEl.dataset.row = String(holderRow);
          changingEl.dataset.col = String(holderCol);
        }
        positionHolderEl.remove();

        const endX = mouseupEvt.pageX;
        const endY = mouseupEvt.pageY;
        const moveX = Math.abs(startX - endX);
        const moveY = Math.abs(startY - endY);

        document.removeEventListener("mouseup", mouseUpHandler);
        document.removeEventListener("mousemove", mousemoveHandler);

        if (new Date().getTime() - startTime < 150 && moveX + moveY < 20) {
          if (!item.url) {
            onClickFolder(item);
          } else {
            openUrl(item.url);
          }
          return;
        }

        if (
          changingElId &&
          testingElId &&
          changingElId !== testingElId && // 같은 값을 북마크 move에 넘기는 경우 크롬 자체가 죽어버리는 현상 발견(이유는 정확히 파악 못했음)
          testingEl?.dataset.type == "FOLDER"
        ) {
          await BookmarkApi.move(changingElId, testingElId);
        } else if (testingEl?.dataset.type == "FILE") {
          changingEl.style.gridColumn = String(originCol);
          changingEl.style.gridRow = String(originRow);
        }
      };

      document.addEventListener("mouseup", mouseUpHandler);
    };

    return {
      folderItem,
      openTooltip,
      closeTooltip,
      openUrl,
      openContextMenu,
      onClickFolder,
      setItemRef,
      mousedownHandler,
      gridContainer,
    };
  },
  data() {
    return {
      gridContainerPadding: `${GRID_CONTAINER_PADDING}px`,
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
  grid-template-columns: repeat(auto-fill, 88px);
  grid-auto-rows: 108px;
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
  width: 88px;
  height: auto;
  padding: 8px;
  /* padding: 4px 0; */
  background: none;
}

.btn:focus {
  background-color: rgba(225, 225, 225, 0.3);
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
