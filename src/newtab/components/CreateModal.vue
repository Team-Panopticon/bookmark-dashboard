<template>
  <vue-final-modal
    v-model="show"
    :name="'createModal'"
    classes="modal-container"
    content-class="modal-content"
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
import { mapGetters } from "vuex";
import { GET_BOOKMARK_CREATE_INFO } from "../store/modules/createModal";
import BookmarkApi from "../utils/bookmarkApi";

export default defineComponent({
  setup() {
    return {};
  },
  data: () => ({
    show: false,
    folderName: "",
  }),
  computed: {
    ...mapGetters({
      createModalInfo: `createModalModule/${GET_BOOKMARK_CREATE_INFO}`,
    }),
  },
  methods: {
    async createFolder(folderName: string) {
      const createSuccessful = await BookmarkApi.create(
        this.createModalInfo.parentId,
        folderName
      );
      if (createSuccessful) {
        this.show = false;
      }
    },
    closeCreateModal() {
      this.show = false;
    },
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
