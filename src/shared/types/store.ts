export type Item = chrome.bookmarks.BookmarkTreeNode;

export type modalInfo = {
  targetId: string;
  children: Item[];
  title: string;
  showBookshelfModal: boolean;
  zIndex: number;
};
