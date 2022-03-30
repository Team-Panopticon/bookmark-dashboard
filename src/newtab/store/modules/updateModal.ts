import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_BOOKMARK_UPDATE_INFO = "getBookmarkUpdateInfo";
export const SET_BOOKMARK_UPDATE_INFO = "setBookmarkUpdateInfo";
export const GET_BOOKMARK_UPDATE_SHOW = "getBookmarkUpdateShow";
export const SET_BOOKMARK_UPDATE_SHOW = "setBookmarkUpdateShow";
export const CLOSE_BOOKMARK_UPDATE = "closeBookmarkUpdateAction";
export const OPEN_BOOKMARK_UPDATE = "openBookmarkUpdateAction";
export interface IUpdateModalInfo {
  id: string;
  url?: string | undefined;
  title: string;
  parentId?: string;
  isFolder: boolean;
}
export interface State {
  updateModalInfo: IUpdateModalInfo;
  updateModalShow: boolean;
}

const updateModalModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    updateModalInfo: {
      id: "",
      url: undefined,
      title: "",
      parentId: "",
      isFolder: false,
    },
    updateModalShow: false,
  },

  getters: {
    [GET_BOOKMARK_UPDATE_SHOW](state) {
      return state.updateModalShow;
    },
    [GET_BOOKMARK_UPDATE_INFO](state) {
      return state.updateModalInfo;
    },
  },
  mutations: {
    [SET_BOOKMARK_UPDATE_INFO](state, _updateModalInfo: IUpdateModalInfo) {
      state.updateModalInfo = { ..._updateModalInfo };
    },
    [SET_BOOKMARK_UPDATE_SHOW](state, _updateModalShow: boolean) {
      state.updateModalShow = _updateModalShow;
    },
  },
  actions: {
    [OPEN_BOOKMARK_UPDATE]({ commit }, updateModalInfo) {
      commit(SET_BOOKMARK_UPDATE_INFO, updateModalInfo);
      commit(SET_BOOKMARK_UPDATE_SHOW, true);
    },

    [CLOSE_BOOKMARK_UPDATE]({ commit }) {
      commit(SET_BOOKMARK_UPDATE_SHOW, false);
    },
  },
};

export default updateModalModule;
