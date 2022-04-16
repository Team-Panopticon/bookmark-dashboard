import { openDB, IDBPDatabase } from "idb";

interface LayoutMap {
  [id: string]: ItemLayout; // key는 Item의 id, desktop === 1
}

interface ItemLayout {
  id: string;
  row: number;
  col: number;
}

const layoutDummy: LayoutMap = {
  "118": {
    id: "118",
    row: 1,
    col: 1,
  },
  "181": {
    id: "181",
    row: 2,
    col: 1,
  },
  "122": {
    id: "122",
    row: 3,
    col: 1,
  },
  "176": {
    id: "176",
    row: 4,
    col: 2,
  },
  "185": {
    id: "185",
    row: 5,
    col: 3,
  },
  "193": {
    id: "193",
    row: 1,
    col: 4,
  },
  "191": {
    id: "191",
    row: 1,
    col: 4,
  },
  "196": {
    id: "196",
    row: 3,
    col: 2,
  },
};

const DB_NAME = "DesktopBookshelfDB";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "desktop";
const READ_ONLY = "readonly";
const READ_WRITE = "readwrite";

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
        objectStore.createIndex("row", "row", { unique: false });
        objectStore.createIndex("col", "col", { unique: false });

        /**
         * @TODO 삭제
         * 더미 삽입용
         */
        Object.values(layoutDummy).forEach((itemLayout: ItemLayout) => {
          objectStore.add(itemLayout);
        });
      },
    });
  }

  async getLayout(): Promise<LayoutMap> {
    const store = this.db
      .transaction(OBJECT_STORE_NAME, READ_ONLY)
      .objectStore(OBJECT_STORE_NAME);

    const result = await store.getAll();
    const layoutMap = parseLayoutData(result);

    return layoutMap;
  }

  setLayout() {
    // Desktop layout data 전체 세팅
  }

  setItemLayoutById(id: string) {
    // layout 하나 변경
  }
}

export const layoutDB = new LayoutDB();
