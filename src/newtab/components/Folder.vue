<template>
  <div v-for="(file, i) in item" v-bind:key="i">
    <div v-if="file.children" @click="open(file.children)" class="red">
      {{ file.title }}
    </div>
    <div v-else>
      {{ file.title }}
    </div>
  </div>
  <vue-final-modal
    v-model="showModal"
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
    <div class="modal-inner">
      <div v-for="(file, i) in children" v-bind:key="i">
        <div v-if="file.children" @click="open(file.children)" class="red">
          {{ file.title + "folder" }}
        </div>
        <div v-else>
          {{ file.title + "file" }}
        </div>
      </div>
    </div>
  </vue-final-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item, Items } from "../../shared/types/store";

export default defineComponent({
  data: () => ({
    showModal: false,
    children: [] as Items,
  }),
  props: {
    item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  methods: {
    open(children: Items) {
      console.log("clicked");
      this.children = children;
      this.showModal = true;
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
  background-color: yellow;
  width: 500px;
  height: 500px;
}
.red {
  color: red;
}
</style>
