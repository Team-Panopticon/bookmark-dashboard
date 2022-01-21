<template>
  <vue-final-modal
    v-model="show"
    :name="'createModal'"
    classes="modal-container"
  >
    <v-card class="modal-content">createModal</v-card>
  </vue-final-modal>
</template>

<script>
export default {
  setup() {
    return {};
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  width: 300px;
  height: 300px;
}
</style>
