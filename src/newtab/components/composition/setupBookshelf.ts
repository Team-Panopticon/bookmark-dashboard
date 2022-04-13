import { ContextMenuTarget } from "@/newtab/store/modules/contextMenu";
import {
  SET_TOOLTIP_POSITION,
  SET_TOOLTIP_SHOW,
  SET_TOOLTIP_TEXT,
} from "@/newtab/store/modules/tooltip";
import BookmarkApi from "@/newtab/utils/bookmarkApi";
import { Item } from "@/shared/types/store";
import { onMounted, computed, watch, ref, Ref } from "vue";
import { useStore } from "vuex";
import { SET_REFRESH_TARGET } from "../../store/index";
import { openContextMenu } from "../../utils/contextMenu";

export interface SetupBookshelf {
  folderItem: Ref<Item>;
  openTooltip: (title: string, event: MouseEvent) => void;
  closeTooltip: () => void;
  openUrl: (id: string, url: string) => void;
  openContextMenu: (event: PointerEvent, target: ContextMenuTarget) => void;
}
type Props = {
  id: string;
};

export const setupBookshelf = (
  props: Props,
  onRefresh?: (folderItem: Item) => Item
): SetupBookshelf => {
  const store = useStore();
  const { id } = props;

  /**
   * Data
   */
  const folderItem = ref({} as Item);
  const refreshTargetId = computed(() => store.getters.GET_REFRESH_TARGET);

  const refresh = async () => {
    folderItem.value = await BookmarkApi.getSubTree(id);
    if (onRefresh) {
      folderItem.value = onRefresh(folderItem.value);
    }
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
    openTooltip,
    closeTooltip,
    openUrl,
    openContextMenu,
  };
};
