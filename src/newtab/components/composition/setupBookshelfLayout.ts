import BookmarkApi from "@/newtab/utils/bookmarkApi";
import { Item } from "@/shared/types/store";
import { onMounted, computed, watch, Ref } from "vue";
import { useStore } from "vuex";
import { SET_REFRESH_TARGET } from "../../store/index";
import { layoutDB } from "@/newtab/utils/layoutDB";

export interface SetupBookshelf {
  setItemRef: (elItem?: HTMLDivElement) => void;
}

interface Props {
  id: string;
  folderItem: Ref<Item>;
}

const appendLayoutData = async (folderItem: Item): Promise<Item> => {
  const layoutData = await layoutDB.getLayout(folderItem.id);
  folderItem.children?.forEach((item: Item) => {
    const { row, col } = layoutData[item.id] ?? {};
    item.row = row;
    item.col = col;
  });

  return folderItem;
};

export const setupBookshelfLayout = (props: Props): SetupBookshelf => {
  const store = useStore();
  const { id, folderItem } = props;

  /**
   * Data
   */
  const refreshTargetId = computed(() => store.getters.GET_REFRESH_TARGET);

  const refresh = async () => {
    folderItem.value = await BookmarkApi.getSubTree(id);
    folderItem.value = await appendLayoutData(folderItem.value);
  };

  watch(refreshTargetId, (newId) => {
    if (newId && props.id === newId) {
      refresh();
      store.commit(SET_REFRESH_TARGET, "");
    }
  });

  /**
   * LifeCycle Hook
   */
  onMounted(() => {
    refresh();
  });

  // row, col이 DB에 없는 애들의 row, col을 계산해서 DB에 저장해줌 + 스타일 추가 (위치 고정)
  const setItemRef = async (elItem?: HTMLDivElement) => {
    if (!elItem) {
      return;
    }

    const id = elItem.dataset.itemId as string;
    const itemLayout = await layoutDB.getItemLayoutById(id);

    if (itemLayout) {
      return;
    }

    const itemWidth = elItem.offsetWidth;
    const itemHeight = elItem.offsetHeight;

    // parent 로부터의 offsetLeft로 스스로의 row, column 계산
    // parent가 min-height, min-width가 제대로 지정되어 있어야 offsetLeft가 정확한 값
    const col = Math.floor((elItem.offsetLeft - 20) / itemWidth) + 1;
    const row = Math.floor((elItem.offsetTop - 20) / itemHeight) + 1;

    // 저장된 초기 row, col 값을 folderItem에 반영
    const originalItem: Item | undefined = folderItem.value.children?.find(
      (item) => item.id === id
    );

    if (!originalItem) {
      return;
    }

    const parentId = originalItem.parentId as string;

    // row column을 DB에 삽입
    layoutDB.setItemLayoutById({ id, parentId, row, col });

    // 저장된 초기 row, col 값을 folderItem에 반영
    originalItem.row = row;
    originalItem.col = col;
  };

  return {
    setItemRef,
  };
};
