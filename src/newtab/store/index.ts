import updateModal from "./modules/updateModal";

import { Item } from "@/shared/types/store";
import { createStore } from "vuex";
import createModalModule from "./modules/createFolderModal";
import createBookshelfModal from "./modules/bookshelfModal";
import contextMenu from "./modules/contextMenu";
import tooltip from "./modules/tooltip";

export const GET_BOOKMARK_TREE_CHILDREN = "getBookmarkTree";
export const GET_BOOKMARK_TREE_ROOT = "getBookmarkTreeRoot";
export const GET_REFRESH_TARGET = "getRefreshTarget";
export const SET_REFRESH_TARGET = "setRefreshTarget";
export const SET_BOOKMARK_TREE = "setBookmarkTree";
export const RENEW_BOOKMARK_TREE = "renewBookmarkTree";

export interface State {
  bookmarkTree: Item;
  refreshTargetId?: string;
}

const store = createStore<State>({
  modules: {
    createModalModule,
    createBookshelfModal,
    contextMenu,
    updateModal,
    tooltip,
  },
  getters: {
    [GET_REFRESH_TARGET](state) {
      return state.refreshTargetId;
    },
  },
  mutations: {
    [SET_REFRESH_TARGET](state, id) {
      state.refreshTargetId = id;
    },
  },
});

export default store;
