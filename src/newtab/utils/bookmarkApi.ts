class BookmarkApi {
  static async create(
    parentId: string,
    title: string,
    url?: string
  ): Promise<boolean> {
    try {
      await chrome.bookmarks.create({ parentId, title, url });
      return true;
    } catch (e) {
      return false;
    }
  }

  static async updateTitle(id: string, title: string): Promise<boolean> {
    try {
      await chrome.bookmarks.update(id, { title });
      return true;
    } catch (e) {
      return false;
    }
  }

  static async updateUrl(id: string, url: string): Promise<boolean> {
    try {
      await chrome.bookmarks.update(id, { url });
      return true;
    } catch (e) {
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
      return false;
    }
  }

  static async remove(id: string): Promise<boolean> {
    try {
      await chrome.bookmarks.remove(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async recursiveRemove(id: string): Promise<boolean> {
    try {
      await chrome.bookmarks.removeTree(id);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default BookmarkApi;
