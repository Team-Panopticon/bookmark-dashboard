import updateModal from "./modules/updateModal";
import BookmarkApi from "../utils/bookmarkApi";

import { Item } from "@/shared/types/store";
import { createStore } from "vuex";
import createModalModule from "./modules/createFolderModal";
import createBookshelfModal from "./modules/bookshelfModal";
import contextMenu from "./modules/contextMenu";

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
  },
  state: {
    bookmarkTree: { title: "placeholder", id: "-1", children: [] } as Item,
  },
  getters: {
    [GET_BOOKMARK_TREE_CHILDREN](state) {
      return state.bookmarkTree.children;
    },
    [GET_BOOKMARK_TREE_ROOT](state) {
      return state.bookmarkTree;
    },
    [GET_REFRESH_TARGET](state) {
      return state.refreshTargetId;
    },
  },
  mutations: {
    [SET_BOOKMARK_TREE](state, _bookmarkTree) {
      state.bookmarkTree = _bookmarkTree;
    },
    [SET_REFRESH_TARGET](state, id) {
      state.refreshTargetId = id;
    },
  },
  actions: {
    async [RENEW_BOOKMARK_TREE]({ commit }) {
      commit(SET_BOOKMARK_TREE, await BookmarkApi.getTree());
    },
  },
});

export default store;
