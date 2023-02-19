import { MODE } from "@/shared/types/store";
import { Module } from "vuex";
import { State as RootState } from "../index";

export const SET_CONFIG_MODE = "setConfigMode";

export const GET_CONFIG_MODE = "getConfigMode";

export type State = {
  mode: MODE;
};

const configModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    mode: (localStorage.getItem("mode") as MODE) || MODE.DARK,
  },

  getters: {
    [GET_CONFIG_MODE](state) {
      return state.mode;
    },
  },
};

export default configModule;
