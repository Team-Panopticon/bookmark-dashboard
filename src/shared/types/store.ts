export type Item = chrome.bookmarks.BookmarkTreeNode;

export type modalInfo = {
  folderItem: Item;
  showBookshelfModal: boolean;
  zIndex: number;
};

export interface FolderItem {
  title: string;
  id: string;
  children: Item[];
}
