export type Item = chrome.bookmarks.BookmarkTreeNode;
export type modalInfo = {
  component: string;
  children: Item[];
  title: string;
  showModal: boolean;
};
