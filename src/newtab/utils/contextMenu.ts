import {
  ContextMenuTarget,
  SET_CONTEXT_MENU_TARGET,
  SET_CONTEXT_MENU_SHOW_STATE,
  SET_CONTEXT_MENU_POSITION,
} from "./../store/modules/contextMenu";
import store from "../store/index";

export const openContextMenu = (
  event: PointerEvent,
  target: ContextMenuTarget
): void => {
  store.commit(SET_CONTEXT_MENU_TARGET, target);
  store.commit(SET_CONTEXT_MENU_POSITION, {
    x: event.clientX,
    y: event.clientY,
  });
  store.commit(SET_CONTEXT_MENU_SHOW_STATE, true);
};
