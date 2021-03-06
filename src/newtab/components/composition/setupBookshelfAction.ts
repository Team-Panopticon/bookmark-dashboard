import { OPEN_BOOKSHELF_MODALS } from "@/newtab/store/modules/bookshelfModal";
import { ContextMenuTarget } from "@/newtab/store/modules/contextMenu";
import {
  SET_TOOLTIP_POSITION,
  SET_TOOLTIP_SHOW,
  SET_TOOLTIP_TEXT,
} from "@/newtab/store/modules/tooltip";
import { Item } from "@/shared/types/store";
import { Ref, SetupContext } from "vue";
import { useStore } from "vuex";
import { openContextMenu } from "../../utils/contextMenu";

interface Props {
  folderItem: Ref<Item>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: SetupContext<Record<string, any>>;
}

interface SetupBookshelfAction {
  openTooltip: (title: string, event: MouseEvent) => void;
  closeTooltip: () => void;
  openUrl: (url: string) => void;
  openContextMenu: (event: PointerEvent, target: ContextMenuTarget) => void;
  onClickFolder: (item: Item) => void;
}

export const setupBookshelfAction = (props: Props): SetupBookshelfAction => {
  const { folderItem, context } = props;
  const store = useStore();

  /**
   * method
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

  const openUrl = (url: string) => {
    window.open(url, "_blank")?.focus();
    store.commit(SET_TOOLTIP_SHOW, false);
  };

  const onClickFolder = (item: Item): void => {
    const isDesktop = folderItem.value.parentId === "0";
    const { id, title } = item;
    if (isDesktop) {
      store.commit(OPEN_BOOKSHELF_MODALS, { id, title });
    } else {
      context.emit("routeInFolder", id);
    }
    store.commit(SET_TOOLTIP_SHOW, false);
  };

  return {
    openTooltip,
    closeTooltip,
    openUrl,
    openContextMenu,
    onClickFolder,
  };
};
