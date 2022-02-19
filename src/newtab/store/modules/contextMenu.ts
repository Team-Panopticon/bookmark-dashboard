import { Item } from "../../../shared/types/store";
import { Module } from "vuex";
import { State as RootState } from "../index";

export const SET_CONTEXT_MENU_SHOW_STATE = "contextMenu/setShow";
export const SET_CONTEXT_MENU_POSITION = "contextMenu/setPosition";
export const SET_CONTEXT_MENU_TARGET = "contextMenu/setTarget";

export const GET_CONTEXT_MENU_CSS_VARS = "contextMenu/getCssVars";
export const GET_CONTEXT_MENU_SHOW_STATE = "contextMenu/getShow";
export const GET_CONTEXT_MENU_TARGET = "contextMenu/getTarget";

export type Position = {
  x: number;
  y: number;
};

export type ContextMenuTarget = {
  item: Item;
  type: "FILE" | "FOLDER" | "BACKGROUND";
};

export type State = {
  isShow: boolean;
  position: Position;
  target?: ContextMenuTarget;
};

const contextMenuModule: Module<State, RootState> = {
  namespaced: true,
  state: () => ({
    isShow: false,
    position: { x: 0, y: 0 },
  }),
  mutations: {
    setShow(state, payload: boolean) {
      state.isShow = payload;
    },
    setPosition(state, payload: Position) {
      state.position = payload;
    },
    setTarget(state, payload: ContextMenuTarget) {
      state.target = payload;
    },
  },
  getters: {
    getCssVars(state) {
      return {
        "--top": `${state.position.y}px`,
        "--left": `${state.position.x}px`,
      };
    },
    getShow(state) {
      return state.isShow;
    },
    getTarget(state) {
      return state.target;
    },
  },
  actions: {},
};

export default contextMenuModule;
