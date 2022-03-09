<template>
  <vue-final-modal
    v-model="show"
    classes="modal-container"
    content-class="modal-content"
    z-index="1100"
  >
    <v-card class="modal-inner" outlined title elevation="7">
      <v-card-header class="modal-banner bg-primary">
        <div class="modal__title d-flex">Create Folder</div>
        <button class="modal__close" @click="closeCreateFolderModal">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <v-card-text class="text-h5 font-weight-bold">
        <v-form :key="createFolder">
          <v-text-field
            v-model="folderName"
            counter
            label="Folder name"
            required
            outlined="true"
            v-on:click.stop.self
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="createFolder(folderName)">Create Folder</v-btn>
        <v-btn @click="closeCreateFolderModal">Cancel</v-btn>
      </v-card-actions>
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
import store, { SET_REFRESH_TARGET } from "../store/index";
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
        store.commit(SET_REFRESH_TARGET, this.createFolderModalInfo.parentId);
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
::v-deep .v-field--active .v-field-label--floating {
  transform: scale(0.75);
}
</style>
