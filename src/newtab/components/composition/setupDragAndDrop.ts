import { Ref, ref } from "vue";

import { Item } from "@/shared/types/store";
import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "../../utils/constant";
import BookmarkApi from "../../utils/bookmarkApi";
import { layoutDB } from "../../utils/layoutDB";
import { SET_TOOLTIP_ON } from "@/newtab/store/modules/tooltip";
import { useStore } from "vuex";
import { PUSH_REFRESH_TARGET } from "@/newtab/store/modules/refreshTarget";

interface SetupDragAndDrop {
  mousedownHandler: (item: Item, mousedown: MouseEvent) => Promise<void>;
  originGridContainer: Ref<HTMLElement | undefined>;
}

interface Props {
  openUrl: (url: string) => void;
  onClickFolder: (item: Item) => void;
}

export const setupDragAndDrop = (props: Props): SetupDragAndDrop => {
  const { openUrl, onClickFolder } = props;
  const store = useStore();

  const onTooltip = () => {
    store.commit(SET_TOOLTIP_ON, true);
  };

  const offTooltip = () => {
    store.commit(SET_TOOLTIP_ON, false);
  };

  /**
      1. down 했을때 위치
      2. move 시킬때 첫 위치와 move 위치의 크기값이 일정 이하일때는 클릭 이동거리 100 이하 && 0.15초 이내
      3. 클릭
    **/
  const getTargetEl = (x: number, y: number): HTMLElement | null => {
    const containerEl = getContainerEl(x, y);
    const mousePositionEls = document
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
    const [mousePositionEl] = document
      .elementsFromPoint(x, y)
      .filter((el) => el.classList.contains("grid-container"));

    return mousePositionEl as HTMLElement;
  };
  let originGridContainerId: string | undefined;
  let prevVisitedContainerTimestamp: string | undefined;
  let originRow = -1;
  let originCol = -1;
  let holderRow: number | string = -1;
  let holderCol: number | string = -1;
  const originGridContainer = ref<HTMLElement>();
  const mousedownHandler = async (item: Item, mousedown: MouseEvent) => {
    offTooltip();
    mousedown.preventDefault();
    originRow = originCol = holderRow = holderCol = -1;

    const gridContainerEl = originGridContainer.value as HTMLElement;
    originGridContainerId = gridContainerEl.dataset.parentId;
    prevVisitedContainerTimestamp = gridContainerEl.dataset.timestamp;

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
        gridContainerEl.insertBefore(positionHolderEl, null);
        positionHolderEl.style.gridColumn = String(originCol);
        positionHolderEl.style.gridRow = String(originRow);
        prevVisitedContainerId = "outOfContainer";
        return;
      }

      const targetGridContainerParentId =
        targetGridContainerEl.dataset.parentId;
      const targetGridContainerTimestamp =
        targetGridContainerEl.dataset.timestamp;

      const isDragOverBetweenContainer =
        targetGridContainerTimestamp !== prevVisitedContainerTimestamp;
      const isWithinContainer = targetGridContainerEl === gridContainerEl;

      if (isDragOverBetweenContainer) {
        positionHolderEl.remove();
        targetGridContainerEl.insertBefore(positionHolderEl, null);
        prevVisitedContainerTimestamp = targetGridContainerTimestamp;
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
        Math.floor((e.clientY - baseY - GRID_CONTAINER_PADDING) / ITEM_HEIGHT) +
        1;
      const calculatedCol =
        Math.floor((e.clientX - baseX - GRID_CONTAINER_PADDING) / ITEM_WIDTH) +
        1;
      const isCalculatedRowAndColValid = calculatedRow > 0 && calculatedCol > 0;

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
      } else {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          activeElement.blur();
        }
      }

      if (targetEl?.dataset.type === "FILE") {
        if (
          targetGridContainerParentId &&
          originGridContainerId &&
          targetGridContainerParentId !== originGridContainerId
        ) {
          positionHolderEl.style.gridColumn = "auto";
          positionHolderEl.style.gridRow = "auto";
        } else {
          positionHolderEl.style.gridColumn = String(originCol);
          positionHolderEl.style.gridRow = String(originRow);
        }
      }
    };

    document.addEventListener("mousemove", mousemoveHandler);

    const mouseUpHandler = async (mouseupEvt: MouseEvent) => {
      const targetGridContainerEl = getContainerEl(
        mouseupEvt.pageX,
        mouseupEvt.pageY
      );

      try {
        // tooptip on
        onTooltip();

        // hander 지우기
        document.removeEventListener("mouseup", mouseUpHandler);
        document.removeEventListener("mousemove", mousemoveHandler);
        positionHolderEl.remove();

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

        if (!targetGridContainerParentId || !changingEl) {
          throw new Error(
            "화면 밖으로 나갈 경우, targetGridContainerParentId가 없거나 changingEl가 없음"
          );
        }

        if (isWithinContainer) {
          if (isInPadding) {
            throw new Error("컨테이너 내부 >> padding에 옮기는 경우");
          }

          // 빈공간
          if (!targetEl || !targetElId) {
            setChangingElPosition(changingEl);
            saveLayoutToDB(Number(holderRow), Number(holderCol));
            store.commit(PUSH_REFRESH_TARGET, [
              originGridContainerId,
              originGridContainerId,
            ]);
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
            throw new Error("컨테이너 내부 >> 파일 위에 옮기는 경우");
          }
        }

        if (isBetweenContainer) {
          /**
           * 1. .modal-inner로 폴더 상위 찾기
           * 2. .modal-inner의 자식 v-breadcrumbs 찾기
           * 3. data-id로 id들 찾기
           * 4. validation (target 있으면 target까지, 없으면 breadcrumb만)
           */

          // 같은 폴더 모달 간에 이동하는 경우 refresh
          if (
            targetGridContainerParentId === gridContainerEl.dataset.parentId
          ) {
            store.commit(PUSH_REFRESH_TARGET, [
              originGridContainerId,
              originGridContainerId,
            ]);
          }

          const targetGridContainerBreadcrumbs = targetGridContainerEl
            .closest(".modal-inner")
            ?.querySelector(".folder-route")
            ?.querySelectorAll("[data-id]");

          if (targetGridContainerBreadcrumbs) {
            const isDropError = [...targetGridContainerBreadcrumbs]
              .map((el) => (el as HTMLElement).dataset.id as string)
              .some((id) => id === changingElId);

            if (isDropError || targetElId === changingElId) {
              throw new Error(
                "컨테이너 간 >> 자신 또는 자신의 자식으로 옮겨질 경우"
              );
            }
          }

          if (isInPadding) {
            await layoutDB.deleteItemLayoutById(changingElId);
            await BookmarkApi.move(changingElId, targetGridContainerParentId); // 폴더에서 같은 값을 북마크 move에 넘기는 경우 크롬 자체가 죽어버리는 현상 발견(이유는 정확히 파악 못했음)
            return;
          }

          // 빈공간
          if (!targetEl || !targetElId) {
            saveLayoutToDB(Number(holderRow), Number(holderCol));
            await BookmarkApi.move(changingElId, targetGridContainerParentId);
            return;
          }

          const targetElType = targetEl.dataset.type as "FOLDER" | "FILE";

          if (
            targetElType === "FOLDER" &&
            targetElId === originGridContainerId
          ) {
            throw new Error("컨테이너 간 >> Item을 같은 폴더로 이동시킬경우");
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
      } catch (e) {
        const error = e as Error;
        console.debug("Drag n Drop 실패", error.message);

        changingEl.style.gridColumn = String(originCol);
        changingEl.style.gridRow = String(originRow);
        fixDom(changingEl);
      }

      /**
       * @TODO
       * switch문으로 리팩토링
       * setup으로 빼기
       * 폴더생성 / 삭제시 새로고침
       */

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

  return { mousedownHandler, originGridContainer };
};
