import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_BOOKMARK_CREATE_INFO = "getBookmarkCreateInfo";
export const SET_BOOKMARK_CREATE_INFO = "setBookmarkCreateInfo";
export const RESET_BOOKMARK_CREATE_INFO = "resetBookmarkCreateInfo";

export interface State {
  createModalInfo: {
    parentId: string;
  };
}

const createModalModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    createModalInfo: {
      parentId: "",
    },
  },
  getters: {
    [GET_BOOKMARK_CREATE_INFO](state) {
      return state.createModalInfo;
    },
  },
  mutations: {
    [SET_BOOKMARK_CREATE_INFO](state, _createModalInfo) {
      state.createModalInfo = _createModalInfo;
    },
    [RESET_BOOKMARK_CREATE_INFO](state) {
      state.createModalInfo = { parentId: "" };
      console.log(state.createModalInfo);
    },
  },
};

export default createModalModule;
