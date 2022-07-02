export interface Item extends chrome.bookmarks.BookmarkTreeNode {
  row?: number;
  col?: number;
  type?: string;
}

export type modalInfo = {
  folderItem: Item;
  showBookshelfModal: boolean;
  zIndex: number;
};

export interface FolderItem {
  title: string;
  id: string;
}
