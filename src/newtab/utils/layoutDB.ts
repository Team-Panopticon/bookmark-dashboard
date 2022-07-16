import { openDB, IDBPDatabase } from "idb";

interface LayoutMap {
  [id: string]: ItemLayout; // key는 Item의 id, desktop === 1
}

interface ItemLayout {
  id: string;
  parentId: string;
  row: number;
  col: number;
}

const DB_NAME = "DesktopBookshelfDB";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "desktop";

const parseLayoutData = (layoutDataArray: ItemLayout[]) => {
  const layoutMap: LayoutMap = {};
  layoutDataArray.forEach((data) => {
    layoutMap[data.id] = data;
  });
  return layoutMap;
};

class LayoutDB {
  private db!: IDBPDatabase<LayoutMap>;

  async initDB() {
    this.db = await openDB<LayoutMap>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const objectStore = db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "id",
        });
        objectStore.createIndex("id", "id", { unique: true });
        objectStore.createIndex("parentId", "parentId", { unique: false });
        objectStore.createIndex("row", "row", { unique: false });
        objectStore.createIndex("col", "col", { unique: false });
      },
    });
  }

  async getLayout(parentId: string): Promise<LayoutMap> {
    const result = await this.db.getAllFromIndex(
      OBJECT_STORE_NAME,
      "parentId",
      parentId
    );
    const layoutMap = parseLayoutData(result);

    return layoutMap;
  }

  async getItemLayoutById(id: string): Promise<ItemLayout | undefined> {
    return await this.db.get(OBJECT_STORE_NAME, id);
  }

  async setItemLayoutById({ id, parentId, row, col }: ItemLayout) {
    await this.db.put(OBJECT_STORE_NAME, { id, parentId, row, col });
  }

  async deleteItemLayoutById(id: string) {
    await this.db.delete(OBJECT_STORE_NAME, id);
  }
}

export const layoutDB = new LayoutDB();
