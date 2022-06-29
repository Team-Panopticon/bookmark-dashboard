<template>
  <div
    class="grid-container"
    ref="originGridContainer"
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
import { defineComponent, PropType, ref } from "vue";
import Favicon from "./Favicon.vue";
import { setupBookshelfAction } from "./composition/setupBookshelfAction";
import { setupBookshelfLayout } from "./composition/setupBookshelfLayout";
import { FolderItem, Item } from "@/shared/types/store";
import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "../utils/constant";
import BookmarkApi from "../utils/bookmarkApi";
import { layoutDB } from "../utils/layoutDB";

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

    /**
      1. down 했을때 위치
      2. move 시킬때 첫 위치와 move 위치의 크기값이 일정 이하일때는 클릭 이동거리 100 이하 && 0.15초 이내
      3. 클릭
    **/
    const getTargetEl = (x: number, y: number): HTMLElement | null => {
      let containerEl = getContainerEl(x, y);
      let mousePositionEls = document
        .elementsFromPoint(x, y)
        .filter(
          (el) =>
            el.classList.contains("btn-wrapper") &&
            !el.classList.contains("positionHolderEl-component") &&
            el.parentElement === containerEl
        );

      return mousePositionEls[0] as HTMLElement;
    };

    const getContainerEl = (x: number, y: number): HTMLElement => {
      let [mousePositionEl] = document
        .elementsFromPoint(x, y)
        .filter((el) => el.classList.contains("grid-container"));

      return mousePositionEl as HTMLElement;
    };
    let originGridContainerId: string | undefined;
    let prevVisitedContainerId = -1;
    let originRow = -1;
    let originCol = -1;
    let holderRow: number | string = -1;
    let holderCol: number | string = -1;
    const originGridContainer = ref<HTMLElement>();
    const mousedownHandler = async (item: Item, mousedown: MouseEvent) => {
      mousedown.preventDefault();
      originRow = originCol = holderRow = holderCol = -1;

      const gridContainerEl = originGridContainer.value as HTMLElement;
      originGridContainerId = gridContainerEl.dataset.parentId;
      prevVisitedContainerId = Number(originGridContainerId);
      const startTime = new Date().getTime();
      const { pageX: startX, pageY: startY } = mousedown;

      /** mousedown 이벤트가 일어난 대상 button 자식 태그들이 될 수 있음 */
      const mousedownTarget = mousedown.target as HTMLElement;
      /** 위치가 변경될 폴더 혹은 파일 Element */
      const changingEl = mousedownTarget.closest(".btn-wrapper") as HTMLElement;

      const changingElId = changingEl.dataset.id as string;

      /** 파일의 기존위치 : 겹쳤을때 되돌리기 용도 */
      originRow = Number(changingEl.dataset.row);
      originCol = Number(changingEl.dataset.col);
      holderRow = Number(changingEl.dataset.row);
      holderCol = Number(changingEl.dataset.col);

      const { x: targetX, y: targetY } = changingEl.getBoundingClientRect();
      // const { x: baseX, y: baseY } = gridContainerEl.getBoundingClientRect();
      /** padding 값에 따른 마우스 포인터와 chaningEl의 상대 위치 값 */
      const offsetX = startX - targetX;
      const offsetY = startY - targetY;

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
      let targetEl: null | HTMLElement = null;
      let targetElId: undefined | string = undefined;

      const mousemoveHandler = (e: MouseEvent) => {
        e.preventDefault();

        const targetGridContainerEl = getContainerEl(e.pageX, e.pageY);
        if (!targetGridContainerEl) {
          positionHolderEl.style.gridColumn = String(originCol);
          positionHolderEl.style.gridRow = String(originRow);
          return;
        }

        const targetGridContainerParentId = Number(
          targetGridContainerEl.dataset.parentId
        );

        const isDragOverBetweenContainer =
          targetGridContainerParentId !== prevVisitedContainerId;
        const isWithinContainer = targetGridContainerEl === gridContainerEl;

        if (isDragOverBetweenContainer) {
          positionHolderEl.remove();
          targetGridContainerEl.insertBefore(positionHolderEl, null);
          prevVisitedContainerId = targetGridContainerParentId;
        }

        const moveX = Math.abs(startX - e.pageX);
        const moveY = Math.abs(startY - e.pageY);
        const { x: baseX, y: baseY } =
          targetGridContainerEl.getBoundingClientRect();
        if (new Date().getTime() - startTime < 150 && moveX + moveY < 20) {
          return;
        }
        changingEl.style.left = `${e.pageX - offsetX}px`;
        changingEl.style.top = `${e.pageY - offsetY}px`;

        const calculatedRow =
          Math.floor(
            (e.clientY - baseY - GRID_CONTAINER_PADDING) / ITEM_HEIGHT
          ) + 1;
        const calculatedCol =
          Math.floor(
            (e.clientX - baseX - GRID_CONTAINER_PADDING) / ITEM_WIDTH
          ) + 1;
        const isCalculatedRowAndColValid =
          calculatedRow > 0 && calculatedCol > 0;

        holderRow = isCalculatedRowAndColValid ? calculatedRow : "auto";
        holderCol = isCalculatedRowAndColValid ? calculatedCol : "auto";

        positionHolderEl.style.gridColumn = String(holderCol);
        positionHolderEl.style.gridRow = String(holderRow);
        targetEl = getTargetEl(e.pageX, e.pageY);
        targetElId = targetEl?.dataset.id;

        const innerBtn = targetEl?.querySelector(".btn") as HTMLElement;
        // 새로운 버튼위로 올라갔을때

        if (!isCalculatedRowAndColValid && isWithinContainer) {
          positionHolderEl.style.gridColumn = String(originCol);
          positionHolderEl.style.gridRow = String(originRow);
        }

        if (targetEl?.dataset.type === "FOLDER") {
          innerBtn?.focus();
        }

        if (targetEl?.dataset.type === "FILE") {
          positionHolderEl.style.gridColumn = String(originCol);
          positionHolderEl.style.gridRow = String(originRow);
        }
      };

      document.addEventListener("mousemove", mousemoveHandler);

      const mouseUpHandler = async (mouseupEvt: MouseEvent) => {
        // hander 지우기
        document.removeEventListener("mouseup", mouseUpHandler);
        document.removeEventListener("mousemove", mousemoveHandler);
        positionHolderEl.remove();

        const targetGridContainerEl = getContainerEl(
          mouseupEvt.pageX,
          mouseupEvt.pageY
        );

        const targetGridContainerParentId =
          targetGridContainerEl?.dataset.parentId;

        const endX = mouseupEvt.pageX;
        const endY = mouseupEvt.pageY;
        const moveX = Math.abs(startX - endX);
        const moveY = Math.abs(startY - endY);

        const isClick =
          new Date().getTime() - startTime < 150 && moveX + moveY < 20;

        // 150ms 이하인 경우 클릭으로 판정하고, 아이템 클릭 시 행동 수행
        if (isClick) {
          if (!item.url) {
            onClickFolder(item);
          } else {
            openUrl(item.url);
          }
          fixDom(changingEl);
          return;
        }

        const isBetweenContainer = targetGridContainerEl !== gridContainerEl;
        const isWithinContainer = !isBetweenContainer;
        const isInPadding = holderRow === "auto" || holderCol === "auto";

        if (
          !targetGridContainerParentId ||
          !changingEl
          // holder Row / Col 확인 필요한지 확인
        ) {
          changingEl.style.gridColumn = String(originCol);
          changingEl.style.gridRow = String(originRow);
          fixDom(changingEl);
          return;
        }

        if (isWithinContainer) {
          if (isInPadding) {
            changingEl.style.gridColumn = String(originCol);
            changingEl.style.gridRow = String(originRow);
            fixDom(changingEl);
            return;
          }

          // 빈공간
          if (!targetEl || !targetElId) {
            setChangingElPosition(changingEl);
            saveLayoutToDB(Number(holderRow), Number(holderCol));
            return;
          }

          const targetElType = targetEl.dataset.type as "FOLDER" | "FILE";

          // 폴더 위
          if (targetElType === "FOLDER" && changingElId !== targetElId) {
            await layoutDB.deleteItemLayoutById(changingElId);
            await BookmarkApi.move(changingElId, targetElId);
            changingEl.remove();
            return;
          }

          // 파일 위
          if (targetElType === "FILE") {
            changingEl.style.gridColumn = String(originCol);
            changingEl.style.gridRow = String(originRow);
            fixDom(changingEl);
            return;
          }
        }

        if (isBetweenContainer) {
          /**
           * 1. .modal-inner로 폴더 상위 찾기
           * 2. .modal-inner의 자식 v-breadcrumbs 찾기
           * 3. data-id로 id들 찾기
           * 4. validation (target 있으면 target까지, 없으면 breadcrumb만)
           */
          const targetGridContainerBreadcrumbs = targetGridContainerEl
            .closest(".modal-inner")
            ?.querySelector(".folder-route")
            ?.querySelectorAll("[data-id]");

          if (targetGridContainerBreadcrumbs) {
            const isDropError = [...targetGridContainerBreadcrumbs]
              .map((el) => (el as HTMLElement).dataset.id as string)
              .some((id) => id === changingElId);

            if (isDropError || targetElId === changingElId) {
              changingEl.style.gridColumn = String(originCol);
              changingEl.style.gridRow = String(originRow);
              fixDom(changingEl);
              return;
            }
          }

          if (isInPadding) {
            await layoutDB.deleteItemLayoutById(changingElId);
            await BookmarkApi.move(changingElId, targetGridContainerParentId); // 폴더에서 같은 값을 북마크 move에 넘기는 경우 크롬 자체가 죽어버리는 현상 발견(이유는 정확히 파악 못했음)
            return;
          }

          // 빈공간
          if (!targetEl || !targetElId) {
            setChangingElPosition(changingEl);
            saveLayoutToDB(Number(holderRow), Number(holderCol));
            await BookmarkApi.move(changingElId, targetGridContainerParentId);
            return;
          }

          const targetElType = targetEl.dataset.type as "FOLDER" | "FILE";

          // a폴더의 첫번째 depth의 자식을 a폴더로 옮길 경우
          if (
            targetElType === "FOLDER" &&
            targetElId === originGridContainerId
          ) {
            changingEl.style.gridColumn = String(originCol);
            changingEl.style.gridRow = String(originRow);
            fixDom(changingEl);
            return;
          }

          // 폴더 위
          if (targetElType === "FOLDER" && changingElId !== targetElId) {
            await layoutDB.deleteItemLayoutById(changingElId);
            await BookmarkApi.move(changingElId, targetElId);
            return;
          }

          // 파일 위
          if (targetElType === "FILE") {
            await layoutDB.deleteItemLayoutById(changingElId);
            await BookmarkApi.move(changingElId, targetGridContainerParentId);
            return;
          }
        }

        function saveLayoutToDB(row: number, col: number) {
          layoutDB.setItemLayoutById({
            id: changingEl.dataset.id as string,
            parentId: targetGridContainerEl.dataset.parentId as string,
            row,
            col,
          });
        }

        function fixDom(target: HTMLElement) {
          target.classList.add("btn-wrapper");
          target.style.position = "relative";
          target.style.top = "unset";
          target.style.left = "unset";
          target.style.zIndex = "inherit";
        }

        function setChangingElPosition(target: HTMLElement) {
          target.style.gridRow = String(holderRow);
          target.style.gridColumn = String(holderCol);
          target.dataset.row = String(holderRow);
          target.dataset.col = String(holderCol);
          fixDom(target);
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
