<template>
  <vue-final-modal
    v-model="_showModal"
    classes="modal-container"
    content-class="modal-content"
    overlay-class="modal-overlay"
    :drag="true"
    :resize="true"
    :max-height="700"
    :max-width="700"
    :hide-overlay="true"
    :click-to-close="false"
    :esc-to-close="true"
    :prevent-click="true"
  >
    <v-card class="modal-inner" outlined title elevation="7">
      <v-card-header class="modal-banner bg-primary">
        <span class="modal__title">
          <v-breadcrumbs :items="[folderTitle, '']"></v-breadcrumbs>
        </span>
        <button class="modal__close" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </button>
      </v-card-header>
      <Bookshelf @openFolder="openFolder" :items="items"> </Bookshelf>
    </v-card>
  </vue-final-modal>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item } from "../../shared/types/store";
import Bookshelf from "../components/Bookshelf.vue";

export default defineComponent({
  components: { Bookshelf },
  data() {
    return {};
  },
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    folderTitle: {
      type: String,
      required: true,
    },
  },
  computed: {
    _showModal: function () {
      return this.showModal;
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    openFolder(title: string, children: Item[]) {
      this.$emit("openFolder", title, children);
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
