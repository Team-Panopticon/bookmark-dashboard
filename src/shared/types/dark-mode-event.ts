export interface DarkModeEvent {
  darkMode: boolean;
}

// eslint-disable-next-line
export const isDarkModeEvent = (event: any): event is DarkModeEvent => {
  if (typeof event?.darkMode === "boolean") {
    return true;
  }
  return false;
};
