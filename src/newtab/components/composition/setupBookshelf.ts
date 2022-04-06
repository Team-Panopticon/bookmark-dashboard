import { OPEN_BOOKSHELF_MODALS } from "@/newtab/store/modules/bookshelfModal";
import {
  SET_TOOLTIP_POSITION,
  SET_TOOLTIP_SHOW,
  SET_TOOLTIP_TEXT,
} from "@/newtab/store/modules/tooltip";
import BookmarkApi from "@/newtab/utils/bookmarkApi";
import { Item } from "@/shared/types/store";
import { onMounted, computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { SET_REFRESH_TARGET } from "../../store/index";
import { openContextMenu } from "../../utils/contextMenu";

export const setupBookshelf = (props: any, context: any) => {
  const store = useStore();
  const { id, isDesktop } = props;

  /**
   * Data
   */
  const folderItem = ref({} as Item);
  const refreshTargetId = computed(() => store.getters.GET_REFRESH_TARGET);

  const refresh = async () => {
    folderItem.value = await BookmarkApi.getSubTree(id);
  };
  watch(refreshTargetId, (newId) => {
    if (newId && props.id === newId) {
      refresh();
      store.commit(SET_REFRESH_TARGET, "");
    }
  });

  /**
   * LifeCycle Hook
   */
  onMounted(() => {
    refresh();
  });

  /**
   * Method
   */
  const onClickFolder = (item: Item) => {
    const { id, title } = item;
    if (isDesktop) {
      store.commit(OPEN_BOOKSHELF_MODALS, { id, title });
    } else {
      context.emit("routeInFolder", id);
    }
    store.commit(SET_TOOLTIP_SHOW, false);
  };
  const openTooltip = (title: string, event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    const buttonElement = targetElement.closest("button");
    if (!buttonElement) return;

    const boundingRect = buttonElement.getBoundingClientRect();
    const position = {
      x: boundingRect.x,
      y: boundingRect.y + boundingRect.height,
    };

    store.commit(SET_TOOLTIP_POSITION, position);
    store.commit(SET_TOOLTIP_TEXT, title);
    store.commit(SET_TOOLTIP_SHOW, true);
  };
  const closeTooltip = () => {
    store.commit(SET_TOOLTIP_SHOW, false);
  };
  const openUrl = (id: string, url: string) => {
    window.open(url, "_blank")?.focus();
    store.commit(SET_TOOLTIP_SHOW, false);
  };

  return {
    folderItem,
    onClickFolder,
    openTooltip,
    closeTooltip,
    openUrl,
    openContextMenu,
  };
};
