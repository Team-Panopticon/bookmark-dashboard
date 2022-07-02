import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_REFRESH_TARGET = "getRefreshTarget";
export const PUSH_REFRESH_TARGET = "pushRefreshTarget";
export const POP_REFRESH_TARGET = "popRefreshTarget";

export interface State {
  refreshTargetIds: Set<string>;
}

const refreshTargetModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    refreshTargetIds: new Set<string>(),
  },
  getters: {
    [GET_REFRESH_TARGET]: (state) => (id: string) =>
      state.refreshTargetIds.has(id),
  },
  mutations: {
    [PUSH_REFRESH_TARGET](state, ids: string[]) {
      ids.forEach((id: string) => {
        state.refreshTargetIds.add(id);
      });
    },
    [POP_REFRESH_TARGET](state, id) {
      state.refreshTargetIds.delete(id);
    },
  },
};

export default refreshTargetModule;
