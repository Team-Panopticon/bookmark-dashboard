<template>
  <vue-final-modal
    v-model="show"
    classes="modal-container"
    content-class="modal-content"
    z-index="1100"
  >
    <v-card class="modal-inner">
      <h2 class="modal-title">Create Folder</h2>
      <v-text-field label="Folder Name" v-model="folderName"></v-text-field>
      <div class="button-group">
        <v-btn color="success" class="mr-4" @click="createFolder(folderName)"
          >Create Folder</v-btn
        >
        <v-btn color="error" @click="closeCreateFolderModal">Cancel</v-btn>
      </div>
    </v-card>
  </vue-final-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { RENEW_BOOKMARK_TREE, SET_BOOKMARK_TREE } from "../store";
import {
  GET_BOOKMARK_CREATE_INFO,
  GET_BOOKMARK_CREATE_SHOW,
  RESET_BOOKMARK_CREATE_INFO,
  SET_BOOKMARK_CREATE_SHOW,
} from "../store/modules/createFolderModal";
import BookmarkApi from "../utils/bookmarkApi";

export default defineComponent({
  setup() {
    return {};
  },
  data: () => ({
    folderName: "",
  }),
  computed: {
    ...mapGetters({
      createFolderModalInfo: GET_BOOKMARK_CREATE_INFO,
      createFolderModalShow: GET_BOOKMARK_CREATE_SHOW,
    }),
    show: {
      get() {
        return this.createFolderModalShow;
      },
      set(newValue: boolean) {
        this.setCreateFolderModalShow(newValue);
      },
    },
  },
  methods: {
    async createFolder(folderName: string) {
      const createSuccessful = await BookmarkApi.create(
        this.createFolderModalInfo.parentId,
        folderName
      );
      if (createSuccessful) {
        this.folderName = "";
        this.resetCreateFolderModalInfo();
        this.setCreateFolderModalShow(false);
        this.renewBookmarkTree();
      }
    },
    closeCreateFolderModal() {
      this.show = false;
    },
    ...mapMutations({
      resetCreateFolderModalInfo: RESET_BOOKMARK_CREATE_INFO,
      setCreateFolderModalShow: SET_BOOKMARK_CREATE_SHOW,
      setBookmarkTree: SET_BOOKMARK_TREE,
    }),
    ...mapActions({
      renewBookmarkTree: RENEW_BOOKMARK_TREE,
    }),
  },
});
</script>

<style lang="scss" scoped>
.vfm::v-deep {
  .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    position: relative;
  }
}
.modal-inner {
  padding: 20px;
}
.modal-title {
  margin-bottom: 16px;
  text-align: center;
}
.button-group {
  display: flex;
  flex-direction: row;
}
::v-deep .v-field--active .v-field-label--floating {
  transform: scale(0.75);
}
</style>
