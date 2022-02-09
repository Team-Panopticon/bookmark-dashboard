import { Module } from "vuex";
import { State as RootState } from "../index";
import { Item } from "@/shared/types/store";

export const GET_BOOKSHELF_MODALS = "getBookshelfModal";

export const OPEN_BOOKSHELF_MODALS = "openBookshelfModal";
export const FOCUS_BOOKSHELF_MODALS = "focusBookshelfModal";
export const CLOSE_BOOKSHELF_MODALS = "closeBookshelfModal";

export interface BookshelfModalParams {
  id: string;
  title: string;
  zIndex: number;
  children: Item[];
}

export interface State {
  currentZIndex: number;
  bookshelfModals: BookshelfModals;
}

export interface BookshelfModals {
  [key: string]: { title: string; children: Item[]; zIndex: number };
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
      const { id, title, children } = bookshelfModalData;
      state.bookshelfModals[id] = {
        title,
        children,
        zIndex: (state.currentZIndex += OFFSET),
      };
      console.debug("open bookshelfModal >> ", id);
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
