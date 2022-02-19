import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_BOOKSHELF_MODALS = "getBookshelfModal";

export const OPEN_BOOKSHELF_MODALS = "openBookshelfModal";
export const FOCUS_BOOKSHELF_MODALS = "focusBookshelfModal";
export const CLOSE_BOOKSHELF_MODALS = "closeBookshelfModal";

export interface BookshelfModalParams {
  id: string;
  zIndex: number;
}

export interface State {
  currentZIndex: number;
  bookshelfModals: BookshelfModals;
}

export interface BookshelfModals {
  [key: string]: { zIndex: number; id: string };
}

const OFFSET = 2;

const createbookshelfModal: Module<State, RootState> = {
  state: {
    currentZIndex: 1000,
    bookshelfModals: {} as BookshelfModals,
  },
  getters: {
    [GET_BOOKSHELF_MODALS](state) {
      return state.bookshelfModals;
    },
  },
  mutations: {
    [OPEN_BOOKSHELF_MODALS](state, bookshelfModalData: BookshelfModalParams) {
      const { id } = bookshelfModalData;
      const currentTime = new Date().toString();
      state.bookshelfModals[currentTime] = {
        id: id,
        zIndex: (state.currentZIndex += OFFSET),
      };
    },
    [FOCUS_BOOKSHELF_MODALS](state, bookshelfModalId: string) {
      state.bookshelfModals[bookshelfModalId].zIndex = state.currentZIndex +=
        OFFSET;
      console.debug("focus bookshelfModal >> ", bookshelfModalId);
    },
    [CLOSE_BOOKSHELF_MODALS](state, bookshelfModalId: string) {
      delete state.bookshelfModals[bookshelfModalId];
      console.debug("open bookshelfModal >> ", bookshelfModalId);
    },
  },
};

export default createbookshelfModal;
