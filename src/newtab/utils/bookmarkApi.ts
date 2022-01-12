import { Item } from "@/shared/types/store";

class BookmarkApi {
  static async getTree(): Promise<Item[]> {
    const bookMarks = await chrome.bookmarks.getTree();
    const [main, _] = bookMarks[0].children || [];
    return main.children || [];
  }

  static async create(
    parentId: string,
    title: string,
    url?: string
  ): Promise<boolean> {
    try {
      await chrome.bookmarks.create({ parentId, title, url });
      return true;
    } catch (e) {
      console.debug("Bookmark Api create error >> ", e);
      return false;
    }
  }

  static async update(
    id: string,
    url: string,
    title?: string
  ): Promise<boolean> {
    try {
      await chrome.bookmarks.update(id, { url, title });
      return true;
    } catch (e) {
      console.debug("Bookmark Api updateTitle error >> ", e);
      return false;
    }
  }

  static async move(
    id: string,
    parentId: string,
    index?: number
  ): Promise<boolean> {
    try {
      await chrome.bookmarks.move(id, { parentId, index });
      return true;
    } catch (e) {
      console.debug("Bookmark Api move error >> ", e);
      return false;
    }
  }

  static async remove(id: string): Promise<boolean> {
    try {
      await chrome.bookmarks.remove(id);
      return true;
    } catch (e) {
      console.debug("Bookmark Api remove error >> ", e);
      return false;
    }
  }

  static async recursiveRemove(id: string): Promise<boolean> {
    try {
      await chrome.bookmarks.removeTree(id);
      return true;
    } catch (e) {
      console.debug("Bookmark Api recursiveRemove error >> ", e);
      return false;
    }
  }
}

export default BookmarkApi;
