<template>
  <BookshelfModal
    v-for="({ zIndex, title, id }, timeStampId) in modals"
    :key="timeStampId"
    :id="id"
    :timeStampId="timeStampId"
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
