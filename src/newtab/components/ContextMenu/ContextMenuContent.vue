<template>
  <div
    class="context-menu-wrapper"
    v-if="target.type === 'FOLDER' || target.type === 'FILE'"
  >
    <button class="context-menu-item" @click="openUpdateModal(target)">
      Edit
    </button>
    <button class="context-menu-item" @click="deleteItem(target)">
      Delete
    </button>
  </div>
  <div class="context-menu-wrapper" v-else>
    <button class="context-menu-item" @click="openCreateFolderModal(target)">
      Create Folder
    </button>
  </div>
</template>

<script lang="ts">
import { ContextMenuTarget } from "@/newtab/store/modules/contextMenu";
import { defineComponent, PropType } from "@vue/runtime-core";
import {
  SET_BOOKMARK_CREATE_SHOW,
  SET_BOOKMARK_CREATE_INFO,
} from "../../store/modules/createFolderModal";
import {
  SET_BOOKMARK_UPDATE_INFO,
  SET_BOOKMARK_UPDATE_SHOW,
} from "../../store/modules/updateModal";
import { SET_CONTEXT_MENU_SHOW_STATE } from "../../store/modules/contextMenu";
import { SET_REFRESH_TARGET } from "../../store/index";
import BookmarkApi from "../../utils/bookmarkApi";
import store from "../../store/index";

export default defineComponent({
  props: {
    target: {
      require: true,
      type: Object as PropType<ContextMenuTarget>,
    },
  },
  methods: {
    openCreateFolderModal(target: ContextMenuTarget) {
      store.commit(SET_BOOKMARK_CREATE_INFO, {
        parentId: target.item.id,
      });
      store.commit(SET_BOOKMARK_CREATE_SHOW, true);
      store.commit(SET_CONTEXT_MENU_SHOW_STATE, false);
    },
    openUpdateModal(target: ContextMenuTarget) {
      const {
        item: { id, title, url, parentId },
      } = target;

      store.commit(SET_BOOKMARK_UPDATE_INFO, {
        id,
        title,
        url,
        parentId,
      });

      store.commit(SET_BOOKMARK_UPDATE_SHOW, true);
      store.commit(SET_CONTEXT_MENU_SHOW_STATE, false);
    },
    async deleteItem(target: ContextMenuTarget) {
      if (confirm("Are you sure you want to delete?")) {
        await BookmarkApi.recursiveRemove(target.item.id);
        store.commit(SET_REFRESH_TARGET, target.item.parentId);
      }
      store.commit(SET_CONTEXT_MENU_SHOW_STATE, false);
    },
  },
});
</script>

<style lang="scss" scoped>
.context-menu-wrapper {
  display: flex;
  flex-direction: column;

  .context-menu-item {
    padding: 4px 8px;
    text-align: start;
    &:hover {
      background-color: rgba(54, 69, 79, 0.2);
      cursor: pointer;
    }
  }
}
</style>
