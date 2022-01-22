import updateModal from "./modules/updateModal";

import { Item } from "@/shared/types/store";
import { createStore } from "vuex";

export const GET_BOOKMARK_TREE = "getBookmarkTree";
export const SET_BOOKMARK_TREE = "setBookmarkTree";

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
});

export default store;
