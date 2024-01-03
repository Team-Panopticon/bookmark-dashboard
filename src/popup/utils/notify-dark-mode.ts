import { DarkModeEvent } from "@/shared/types/dark-mode-event";

export const notifyDarkMode = (darkMode: boolean): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const id = tabs[0].id;
    if (id) {
      const event: DarkModeEvent = { darkMode };
      chrome.tabs.sendMessage(id, event);
    }
  });
};
