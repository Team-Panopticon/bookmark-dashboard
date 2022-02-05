<template>
  <vue-final-modal
    v-model="show"
    :name="'createModal'"
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
        <v-btn color="error" @click="closeCreateModal">Cancel</v-btn>
      </div>
    </v-card>
  </vue-final-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import { SET_BOOKMARK_TREE } from "../store";
import {
  GET_BOOKMARK_CREATE_INFO,
  GET_BOOKMARK_CREATE_SHOW,
  RESET_BOOKMARK_CREATE_INFO,
  SET_BOOKMARK_CREATE_SHOW,
} from "../store/modules/createModal";
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
      createModalInfo: GET_BOOKMARK_CREATE_INFO,
      createModalShow: GET_BOOKMARK_CREATE_SHOW,
    }),
    show: {
      get() {
        return this.createModalShow;
      },
      set(newValue: boolean) {
        this.setCreateModalShow(newValue);
      },
    },
  },
  methods: {
    async createFolder(folderName: string) {
      const createSuccessful = await BookmarkApi.create(
        this.createModalInfo.parentId,
        folderName
      );
      if (createSuccessful) {
        this.folderName = "";
        this.resetCreateModalInfo();
        this.setCreateModalShow(false);
        this.setBookmarkTree(await BookmarkApi.getTree());
      }
    },
    closeCreateModal() {
      this.show = false;
    },
    ...mapMutations({
      resetCreateModalInfo: RESET_BOOKMARK_CREATE_INFO,
      setCreateModalShow: SET_BOOKMARK_CREATE_SHOW,
      setBookmarkTree: SET_BOOKMARK_TREE,
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
