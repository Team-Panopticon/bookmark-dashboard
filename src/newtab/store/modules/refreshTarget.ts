import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_REFRESH_TARGET = "getRefreshTarget";
export const PUSH_REFRESH_TARGET = "pushRefreshTarget";
export const POP_REFRESH_TARGET = "popRefreshTarget";

export interface State {
  refreshTargetIds: Array<string>;
}

const refreshTargetModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    refreshTargetIds: new Array<string>(),
  },
  getters: {
    [GET_REFRESH_TARGET]: (state) => (id: string) =>
      state.refreshTargetIds.includes(id),
  },
  mutations: {
    [PUSH_REFRESH_TARGET](state, ids: string[]) {
      ids.forEach((id: string) => {
        state.refreshTargetIds.push(id);
      });
    },
    [POP_REFRESH_TARGET](state, id) {
      const idx = state.refreshTargetIds.findIndex(
        (targetId) => targetId === id
      );
      state.refreshTargetIds.splice(idx, 1);
    },
  },
};

export default refreshTargetModule;
