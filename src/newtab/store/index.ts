import { Item } from "@/shared/types/store";
import { createStore } from "vuex";

export interface State {
  bookmarkTree: Item[];
}

const store = createStore<State>({
  state: {
    bookmarkTree: [] as Item[],
  },
  getters: {
    getBookmarkTree(state) {
      return state.bookmarkTree;
    },
  },
  mutations: {
    setBookmarkTree(state, _bookmarkTree) {
      state.bookmarkTree = _bookmarkTree;
    },
  },
});

export default store;
