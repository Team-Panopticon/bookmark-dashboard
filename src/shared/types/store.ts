export type Item = chrome.bookmarks.BookmarkTreeNode;
export type modalInfo = {
  children: Item[];
  title: string;
  showModal: boolean;
  zIndex: number;
};
