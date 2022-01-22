import { Module } from "vuex";
import { RootState } from "../index";

export const GET_BOOKMARK_UPDATE_INFO = "getBookmarkUpdateInfo";
export const SET_BOOKMARK_UPDATE_INFO = "setBookmarkUpdateInfo";
export const GET_BOOKMARK_UPDATE_SHOW = "getBookmarkUpdateShow";
export const SET_BOOKMARK_UPDATE_SHOW = "setBookmarkUpdateShow";

export interface State {
  updateModalInfo: {
    id: string;
    url: string;
    title: string;
  };
  updateModalShow: boolean;
}

const updateModalModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    updateModalInfo: {
      id: "",
      url: "",
      title: "",
    },
    updateModalShow: false,
  },

  getters: {
    [GET_BOOKMARK_UPDATE_SHOW](state) {
      return state.updateModalInfo;
    },
    [GET_BOOKMARK_UPDATE_INFO](state) {
      return state.updateModalInfo;
    },
  },
  mutations: {
    [GET_BOOKMARK_UPDATE_SHOW](state, _updateModalInfo) {
      state.updateModalInfo = { ..._updateModalInfo };
    },
    [GET_BOOKMARK_UPDATE_SHOW](state, _updateModalShow) {
      state.updateModalShow = _updateModalShow;
    },
  },
};

export default updateModalModule;
