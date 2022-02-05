import { Item } from "@/shared/types/store";
import { createStore } from "vuex";
import createModalModule from "./modules/createModal";
import createBookshelfModal from "./modules/bookshelfModal";

export const GET_BOOKMARK_TREE_CHILDREN = "getBookmarkTree";
export const GET_BOOKMARK_TREE_ROOT = "getBookmarkTreeRoot";
export const SET_BOOKMARK_TREE = "setBookmarkTree";

export interface State {
  bookmarkTree: Item;
}

const store = createStore<State>({
  modules: { createModalModule, createBookshelfModal },
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
  },
  mutations: {
    [SET_BOOKMARK_TREE](state, _bookmarkTree) {
      state.bookmarkTree = _bookmarkTree;
    },
  },
});

export default store;
