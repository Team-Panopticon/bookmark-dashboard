import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_REFRESH_TIME = "getRefreshTime";
export const UPDATE_REFRESH_TIMES = "updateRefreshTimes";

export interface State {
  recentRefreshTimes: Map<string, number>;
}

const refreshTargetModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    recentRefreshTimes: new Map<string, number>(),
  },
  getters: {
    [GET_REFRESH_TIME]: (state) => (id: string) =>
      state.recentRefreshTimes.get(id),
  },
  mutations: {
    [UPDATE_REFRESH_TIMES](state, ids: string[]) {
      ids.forEach((id) => {
        state.recentRefreshTimes.set(id, new Date().getTime());
      });
    },
  },
};

export default refreshTargetModule;
