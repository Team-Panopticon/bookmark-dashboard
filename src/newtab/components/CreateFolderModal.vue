<template>
  <vue-final-modal
    v-model="show"
    classes="modal-container"
    content-class="modal-content"
    z-index="9999"
    :esc-to-close="true"
    :click-to-close="false"
  >
    <v-card class="modal-inner" outlined title elevation="7">
      <v-card-header class="modal-banner bg-primary">
        <div class="modal__title d-flex">Create Folder</div>
        <button class="modal__close" @click="closeCreateFolderModal">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <v-card-text class="text-h5">
        <v-form :key="createFolder">
          <v-text-field
            v-model="folderName"
            counter
            label="Folder name"
            required
            outlined="true"
            v-on:click.stop.self
            v-on:keydown.enter.stop="createFolder(folderName)"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="createFolder(folderName)">Create</v-btn>
        <v-btn @click="closeCreateFolderModal">Cancel</v-btn>
      </v-card-actions>
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
  },
});
</script>

<style lang="scss" scoped>
.v-card-text {
  opacity: 0.9;
  padding-top: 16px;
}
</style>
