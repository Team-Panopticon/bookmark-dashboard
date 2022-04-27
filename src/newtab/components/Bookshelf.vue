<template>
  <div
    class="grid-container"
    ref="grid-container"
    @contextmenu.prevent.stop="
      openContextMenu($event, { item: folderItem, type: 'BACKGROUND' })
    "
    :data-parent-id="id"
  >
    <div class="divider hide"></div>
    <div
      v-for="item in children"
      v-bind:key="item.id"
      :data-index="item.index"
      :data-id="item.id"
      :data-type="item.type"
      @mousedown="mousedown(item, $event)"
      class="btn-wrapper"
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
    lastUpdated: new Date().getTime(),
  }),
  computed: {
    ...mapGetters({ refreshTargetId: GET_REFRESH_TARGET }),
    children() {
      return this.folderItem.children?.map((e) => {
        return { ...e, type: e.children ? "FOLDER" : "FILE" };
      });
    },
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
    // 1. down 했을때 위치
    // 2. move 시킬때 첫 위치와 move 위치의 크기값이 일정 이하일때는 클릭
    // 이동거리 100 이하 && 0.1초 이내
    // 3. 클릭

    mousedown(item: Item, mousedown: MouseEvent) {
      mousedown.preventDefault();
      const gridContainer = document.querySelector(
        ".grid-container"
      ) as HTMLElement;

      const startTime = new Date().getTime();
      const startX = mousedown.pageX;
      const startY = mousedown.pageY;
      const changing = mousedown.target as HTMLElement;
      let changingEl: null | HTMLElement = null;
      const btnWrapper = changing.closest(".btn-wrapper") as HTMLElement;
      const changingId = btnWrapper.dataset.id;
      const index = Number(btnWrapper.dataset.index);
      const {
        x: targetX,
        y: targetY,
        height,
      } = btnWrapper.getBoundingClientRect();
      // Todo 패딩값 8px style에서 가져오기
      const offsetX = startX - targetX - 8;
      const offsetY = startY - targetY - 8;
      // offsetX, offsetY 아이콘의 어디에 마우스가 있는지?
      const ghost = btnWrapper.cloneNode(true) as HTMLElement;
      const divider = document.querySelector(".divider") as HTMLElement;
      divider.style.height = `${height}px`;
      ghost.classList.add("ghost-component");
      ghost.dataset.index = "-1";
      btnWrapper.classList.remove("btn-wrapper");
      gridContainer.insertBefore(ghost, btnWrapper);
      btnWrapper.style.zIndex = "9999";
      btnWrapper.style.left = `${startX - offsetX}px`;
      btnWrapper.style.top = `${startY - offsetY}px`;
      btnWrapper.style.position = "absolute";

      let targetIdx: undefined | number = undefined;
      let targetId: undefined | string = undefined;
      let positionFlag = 0;

      const mousemoveHandler = (e: MouseEvent) => {
        e.preventDefault();

        if (new Date().getTime() - startTime < 100) {
          return;
        }

        btnWrapper.style.left = `${e.clientX - offsetX}px`;
        btnWrapper.style.top = `${e.clientY - offsetY}px`;
        let els = document.elementsFromPoint(e.pageX, e.pageY);
        const btnWrappers = els.filter((el) => {
          return el.classList.contains("btn-wrapper");
        });

        changingEl = btnWrappers[0] as HTMLElement;
        const newTargetIdx = Number(changingEl?.dataset.index);

        targetId = changingEl?.dataset.id;
        // 새로운 버튼위로 올라갔을때
        if (!isNaN(newTargetIdx)) {
          const { width, x, y } = changingEl.getBoundingClientRect();
          const quarter = width / 4;
          const currentPosition = e.pageX;
          const isLeftSide = currentPosition < quarter + x;
          const isCenter =
            currentPosition >= quarter + x &&
            currentPosition <= quarter * 3 + x;
          // const isRightSide = currentPosition > quarter * 3 + x;
          const innerBtn = changingEl.querySelector(".btn") as HTMLElement;

          if (isLeftSide) {
            innerBtn.blur();
            targetIdx = newTargetIdx;
            divider.classList.remove("hide");
            divider.style.left = `${x}px`;
            divider.style.top = `${y}px`;
            positionFlag = -1;
          } else if (isCenter) {
            // TODO: 대상이 폴더인 경우 안에 삽입
            // TODO: 대상이 파일인 경우 아무것도 안하거나
            innerBtn.focus();
            divider.classList.add("hide");
            positionFlag = 0;
          } else {
            innerBtn.blur();
            targetIdx = newTargetIdx + 1;
            divider.classList.remove("hide");
            divider.style.left = `${width + x}px`;
            divider.style.top = `${y}px`;
            positionFlag = 1;
          }

          // 마우스포인트가
          // gridContainer.insertBefore(newGhost, changingEl);
        } else {
          divider.classList.add("hide");
        }
        // 버튼 외부영역

        if (newTargetIdx !== -1) {
          targetIdx = Number(changingEl?.dataset.index);
        }
      };
      document.addEventListener("mousemove", mousemoveHandler);
      const handleMouseUp = (mouseupEvt: MouseEvent) => {
        divider.classList.add("hide");
        btnWrapper.classList.add("btn-wrapper");

        btnWrapper.style.position = "relative";
        btnWrapper.style.top = "unset";
        btnWrapper.style.left = "unset";
        btnWrapper.style.zIndex = "inherit";

        ghost.remove();

        const endX = mouseupEvt.pageX;
        const endY = mouseupEvt.pageY;
        const moveX = Math.abs(startX - endX);
        const moveY = Math.abs(startY - endY);

        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", mousemoveHandler);

        if (new Date().getTime() - startTime < 100 && moveX + moveY < 20) {
          if (!item.url) {
            this.onClickFolder(item);
          }
          return;
        }
        // Todo
        if (targetIdx !== -1 && index !== -1) {
          if (positionFlag == 1) {
            changingEl?.after(btnWrapper);
          } else if (positionFlag == -1) {
            gridContainer.insertBefore(btnWrapper, changingEl);
          } else {
            if (
              changingId &&
              targetId &&
              changingEl?.dataset.type == "FOLDER"
            ) {
              BookmarkApi.move(changingId, targetId);
              this.refresh();
            }
          }
        }
      };

      document.addEventListener("mouseup", handleMouseUp);
    },
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
      this.lastUpdated = await new Date().getTime();
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
.divider {
  position: absolute;
  border-left: 2px solid grey;
}

.hide {
  border: none;
}

.btn-wrapper {
  display: flex;
  justify-content: center;
  background: none;
  transition: all 800ms ease;
}

.ghost-component {
  opacity: 0.5;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, auto));
  grid-auto-rows: 100px;
  grid-gap: inherit;
  padding: 20px;
  width: 100%;
  height: 100%;
  transition: all 2s ease;
}

.btn {
  width: 80px;
  height: auto;
  padding: 4px 0;
  background: none;
}
.btn:focus {
  background-color: rgba(225, 225, 225, 0.3);
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
