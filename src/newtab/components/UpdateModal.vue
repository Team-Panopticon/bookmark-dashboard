<template>
  <vue-final-modal
    v-model="bookmarkUpdateShow"
    classes="modal-container"
    content-class="modal-content"
    overlay-class="modal-overlay"
    :drag="true"
    :resize="true"
    :max-height="700"
    :max-width="700"
    :hide-overlay="true"
    :click-to-close="false"
    :esc-to-close="false"
    :prevent-click="true"
    z-index="9999"
  >
    <v-card class="modal-inner" outlined title elevation="7">
      <v-card-header class="modal-banner bg-primary">
        <div class="modal__title d-flex">{{ modalTitle }}</div>
        <button class="modal__close" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>

      <v-card-text class="text-h5 font-weight-bold">
        <v-form :key="bookmarkUpdateModalInfo">
          <v-text-field
            v-model="bookmarkUpdateModalInfo.title"
            counter
            label="이름"
            required
            outlined="true"
          ></v-text-field>
          <v-text-field
            v-show="isBookmark"
            v-model="bookmarkUpdateModalInfo.url"
            label="URL"
            required
          >
          </v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="update"> 저장 </v-btn>

        <v-btn @click="closeModal"> 취소 </v-btn>
      </v-card-actions>
    </v-card>
  </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Item } from "../../shared/types/store";
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  GET_BOOKMARK_UPDATE_INFO,
  SET_BOOKMARK_UPDATE_INFO,
  GET_BOOKMARK_UPDATE_SHOW,
  SET_BOOKMARK_UPDATE_SHOW,
  CLOSE_BOOKMARK_UPDATE,
} from "../store/modules/updateModal";

import { RENEW_BOOKMARK_TREE } from "../store/index";
import BookmarkApi from "../utils/bookmarkApi";
export default defineComponent({
  computed: {
    ...mapGetters([GET_BOOKMARK_UPDATE_SHOW, GET_BOOKMARK_UPDATE_INFO]),
    bookmarkUpdateModalInfo: {
      get(): Item {
        return this[GET_BOOKMARK_UPDATE_INFO];
      },
      set(val: Item) {
        this[SET_BOOKMARK_UPDATE_INFO](val);
      },
    },
    bookmarkUpdateShow: {
      get(): boolean {
        return this[GET_BOOKMARK_UPDATE_SHOW];
      },
      set(val: boolean) {
        this[SET_BOOKMARK_UPDATE_SHOW](val);
      },
    },
    isBookmark(): boolean {
      return this[GET_BOOKMARK_UPDATE_INFO].url;
    },
    modalTitle(): string {
      return this.isBookmark ? "북마크 수정" : "폴더 이름 바꾸기";
    },
  },
  methods: {
    ...mapActions([CLOSE_BOOKMARK_UPDATE, RENEW_BOOKMARK_TREE]),
    ...mapMutations([SET_BOOKMARK_UPDATE_INFO, SET_BOOKMARK_UPDATE_SHOW]),
    closeModal() {
      this[CLOSE_BOOKMARK_UPDATE]();
    },
    async update() {
      const { id, title, url } = this.bookmarkUpdateModalInfo;
      const updateSuccessful = await BookmarkApi.update(id, title, url);
      if (updateSuccessful) {
        this[RENEW_BOOKMARK_TREE]();
        this[CLOSE_BOOKMARK_UPDATE]();
      }
    },
  },
});
</script>

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  width: 500px;
  height: 500px;
}

.modal-inner {
  border: 1px solid lightgray;
}

.modal-banner {
  display: flex;
  justify-content: space-between;
}
</style>