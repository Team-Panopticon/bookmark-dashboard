<template>
  <BookshelfModal
    v-for="({ zIndex, title, id }, bookshelfModalId) in modals"
    :key="bookshelfModalId"
    :id="id"
    :bookshelfModalId="bookshelfModalId"
    :title="title"
    :zIndex="zIndex"
  ></BookshelfModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { GET_BOOKSHELF_MODALS } from "../store/modules/bookshelfModal";
import BookshelfModal from "./BookshelfModal.vue";

export default defineComponent({
  components: {
    BookshelfModal,
  },
  computed: {
    ...mapGetters({ modals: GET_BOOKSHELF_MODALS }),
  },
});
</script>

<style scoped></style>
