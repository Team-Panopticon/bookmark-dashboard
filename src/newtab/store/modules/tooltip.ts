import { Module } from "vuex";
import { State as RootState } from "../index";

export const GET_TOOLTIP_POSITION = "getTooltipPosition";
export const SET_TOOLTIP_POSITION = "setTooltipPosition";
export const GET_TOOLTIP_TEXT = "getTooltipText";
export const SET_TOOLTIP_TEXT = "setTooltipText";
export const GET_TOOLTIP_SHOW = "getTooltipShow";
export const SET_TOOLTIP_SHOW = "setTooltipShow";

export interface State {
  tooltipPosition: {
    x: number;
    y: number;
  };
  tooltipText: string;
  tooltipShow: boolean;
}

const createModalModule: Module<State, RootState> = {
  namespaced: false,
  state: {
    tooltipPosition: { x: 0, y: 0 },
    tooltipText: "",
    tooltipShow: false,
  },
  getters: {
    [GET_TOOLTIP_POSITION](state) {
      return state.tooltipPosition;
    },
    [GET_TOOLTIP_TEXT](state) {
      return state.tooltipText;
    },
    [GET_TOOLTIP_SHOW](state) {
      return state.tooltipShow;
    },
  },
  mutations: {
    [SET_TOOLTIP_POSITION](state, _tooltipPosition) {
      state.tooltipPosition = _tooltipPosition;
    },
    [SET_TOOLTIP_TEXT](state, _tooltipText) {
      state.tooltipText = _tooltipText;
    },
    [SET_TOOLTIP_SHOW](state, _tooltipShow) {
      state.tooltipShow = _tooltipShow;
    },
  },
};

export default createModalModule;
