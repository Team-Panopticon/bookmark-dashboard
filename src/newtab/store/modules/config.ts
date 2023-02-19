import { Module } from "vuex";
import { State as RootState } from "../index";

export const SET_CONFIG_MODE = "setConfigMode";

export const GET_CONFIG_MODE = "getConfigMode";

export type MODE = "DARK" | "LIGHT";
export type State = {
  mode: MODE;
};

const configModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    mode: "DARK",
  },
  mutations: {
    [SET_CONFIG_MODE](state, payload: MODE) {
      return (state.mode = payload);
    },
  },
  getters: {
    [GET_CONFIG_MODE](state) {
      return state.mode;
    },
  },
};

export default configModule;
