import { Item } from "@/shared/types/store";
import { createStore } from "vuex";

import createBookshelfModal from "./modules/bookshelfModal";

export const GET_BOOKMARK_TREE = "getBookmarkTree";
export const SET_BOOKMARK_TREE = "setBookmarkTree";

export interface State {
  bookmarkTree: Item[];
}

const store = createStore<State>({
  modules: { createBookshelfModal },
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
});

export default store;
