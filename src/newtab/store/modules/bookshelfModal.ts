import { Module } from "vuex";
import { State as RootState } from "../index";
import { Item } from "@/shared/types/store";

export const GET_BOOKSHELF_MODALS = "getBookshelfModal";

export const OPEN_BOOKSHELF_MODALS = "openBookshelfModal";
export const FOCUS_BOOKSHELF_MODALS = "focusBookshelfModal";
export const CLOSE_BOOKSHELF_MODALS = "closeBookshelfModal";

export const GET_BOOKSHELF_MODALS_CURRENT_POSITION =
  "getBookshelfModalsCurrentPosition";
export const UPDATE_BOOKSHELF_MODALS_CURRENT_POSITION =
  "updateBookshelfModalsCurrentPosition";

export interface BookshelfModalParams {
  id: string;
  title: string;
  zIndex: number;
  children: Item[];
}

export interface State {
  currentZIndex: number;
  bookshelfModals: BookshelfModals;
  currentPosition: Position;
}

export interface Position {
  top: number;
  right: number;
}

export interface BookshelfModals {
  [key: string]: { title: string; children: Item[]; zIndex: number };
}

const OFFSET = 2;
const POSITION_OFFSET = 50;

const createbookshelfModal: Module<State, RootState> = {
  state: {
    currentZIndex: 1000,
    bookshelfModals: {} as BookshelfModals,
    currentPosition: { top: 0, right: 0 } as Position,
  },
  getters: {
    [GET_BOOKSHELF_MODALS](state) {
      return state.bookshelfModals;
    },
    [GET_BOOKSHELF_MODALS_CURRENT_POSITION](state) {
      const { top, right } = state.currentPosition;
      state.currentPosition = {
        top: top + POSITION_OFFSET,
        right: right + POSITION_OFFSET,
      };
      return { top, right };
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
    [UPDATE_BOOKSHELF_MODALS_CURRENT_POSITION](state, position?: Position) {
      const targetPosition = position ?? { top: 100, right: 100 };
      state.currentPosition = targetPosition;
    },
  },
};

export default createbookshelfModal;
