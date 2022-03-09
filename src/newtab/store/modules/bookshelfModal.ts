import { Module } from "vuex";
import { State as RootState } from "../index";

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
  zIndex: number;
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
  [key: string]: { zIndex: number; id: string };
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
      return (modalHeight: number, modalWidth: number) => {
        const { top, right } = state.currentPosition;
        const { offsetHeight, offsetWidth } = document.body;

        const targetPosition = {
          top: top + modalHeight >= offsetHeight ? 0 : top,
          right: right + modalWidth >= offsetWidth ? 0 : right,
        };

        state.currentPosition = {
          top: targetPosition.top + POSITION_OFFSET,
          right: targetPosition.right + POSITION_OFFSET,
        };
        return targetPosition;
      };
    },
  },
  mutations: {
    [OPEN_BOOKSHELF_MODALS](state, bookshelfModalData: BookshelfModalParams) {
      const { id } = bookshelfModalData;
      const timeStampId = new Date().toString();
      state.bookshelfModals[timeStampId] = {
        id: id,
        zIndex: (state.currentZIndex += OFFSET),
      };
      console.debug("open bookshelfModal >> ", timeStampId);
    },
    [FOCUS_BOOKSHELF_MODALS](state, timeStampId: string) {
      state.bookshelfModals[timeStampId].zIndex = state.currentZIndex += OFFSET;
      console.debug("focus bookshelfModal >> ", timeStampId);
    },
    [CLOSE_BOOKSHELF_MODALS](state, timeStampId: string) {
      delete state.bookshelfModals[timeStampId];
      console.debug("close bookshelfModal >> ", timeStampId);
    },
    [UPDATE_BOOKSHELF_MODALS_CURRENT_POSITION](state, position: Position) {
      const targetPosition = {
        top: position.top + POSITION_OFFSET,
        right: position.right + POSITION_OFFSET,
      };
      state.currentPosition = targetPosition;
    },
  },
};

export default createbookshelfModal;
