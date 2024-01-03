import updateModal from "./modules/updateModal";

import { createStore } from "vuex";
import createModalModule from "./modules/createFolderModal";
import createBookshelfModal from "./modules/bookshelfModal";
import contextMenu from "./modules/contextMenu";
import tooltip from "./modules/tooltip";
import refreshTarget from "./modules/refreshTarget";

export const GET_BOOKMARK_TREE_CHILDREN = "getBookmarkTree";
export const GET_BOOKMARK_TREE_ROOT = "getBookmarkTreeRoot";
export const SET_BOOKMARK_TREE = "setBookmarkTree";
export const RENEW_BOOKMARK_TREE = "renewBookmarkTree";

export type State = Record<string, unknown>;

const store = createStore<State>({
  modules: {
    createModalModule,
    createBookshelfModal,
    contextMenu,
    updateModal,
    tooltip,
    refreshTarget,
  },
});

export default store;
