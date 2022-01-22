<template>
  <vue-final-modal
    v-model="show"
    :name="'createModal'"
    classes="modal-container"
  >
    <v-card class="modal-content">
      <h2 class="modal-title">Create Folder</h2>
      <v-text-field label="Folder Name"></v-text-field>
      <div class="button-group">
        <v-btn color="success" class="mr-4">Create Folder</v-btn>
        <v-btn color="error" @click="closeCreateModal">Cancel</v-btn>
      </div>
    </v-card>
  </vue-final-modal>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  data: () => ({
    show: false,
  }),
  methods: {
    closeCreateModal() {
      this.show = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  position: relative;
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
</style>
