import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_BOOKMARK_CREATE_INFO = "getBookmarkCreateInfo";
export const SET_BOOKMARK_CREATE_INFO = "setBookmarkCreateInfo";
export const RESET_BOOKMARK_CREATE_INFO = "resetBookmarkCreateInfo";
export const GET_BOOKMARK_CREATE_SHOW = "getBookmarkCreateShow";
export const SET_BOOKMARK_CREATE_SHOW = "setBookmarkCreateShow";

export interface State {
  createModalInfo: {
    parentId: string;
  };
  createModalShow: boolean;
}

const createModalModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    createModalInfo: {
      parentId: "",
    },
    createModalShow: false,
  },
  getters: {
    [GET_BOOKMARK_CREATE_INFO](state) {
      return state.createModalInfo;
    },
    [GET_BOOKMARK_CREATE_SHOW](state) {
      return state.createModalShow;
    },
  },
  mutations: {
    [SET_BOOKMARK_CREATE_INFO](state, _createModalInfo) {
      state.createModalInfo = _createModalInfo;
    },
    [SET_BOOKMARK_CREATE_SHOW](state, _createModalShow) {
      state.createModalShow = _createModalShow;
    },
    [RESET_BOOKMARK_CREATE_INFO](state) {
      state.createModalInfo = { parentId: "" };
    },
  },
};

export default createModalModule;
