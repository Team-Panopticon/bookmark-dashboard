export type Item = chrome.bookmarks.BookmarkTreeNode;

export type modalInfo = {
  children: Item[];
  title: string;
  showBookshelfModal: boolean;
  zIndex: number;
};
