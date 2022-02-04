import updateModal from "./modules/updateModal";

import { Item } from "@/shared/types/store";
import { createStore } from "vuex";
import BookmarkApi from "../utils/bookmarkApi";
export const GET_BOOKMARK_TREE = "getBookmarkTree";
export const SET_BOOKMARK_TREE = "setBookmarkTree";
export const RENEW_BOOKMARK_TREE = "renewBookmarkTree";

export interface RootState {
  bookmarkTree: Item[];
}

const store = createStore<RootState>({
  modules: { updateModal },
  state: {
    bookmarkTree: [] as Item[],
  },
  getters: {
    [GET_BOOKMARK_TREE](state) {
      return state.bookmarkTree;
    },
  },
  mutations: {
    [SET_BOOKMARK_TREE](state, _bookmarkTree) {
      state.bookmarkTree = _bookmarkTree;
    },
  },
  actions: {
    async [RENEW_BOOKMARK_TREE]({ commit }) {
      commit(SET_BOOKMARK_TREE, await BookmarkApi.getTree());
    },
  },
});

export default store;
