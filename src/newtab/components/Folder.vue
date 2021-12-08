<template>
  <div v-for="(file, i) in Item" v-bind:key="i">
    <div v-if="file.type == 'folder'" @click="open(file.id)">
      {{ file.title }}
      <modal
        :ref="`modal-${file.id}`"
        name="file.title"
        draggable="true"
        :adaptive="true"
      ></modal>
    </div>
    <div v-else>
      {{ file.title }}
    </div>
  </div>

  <!-- <Folder :Item=""></Folder> -->
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Item } from "../../shared/types/store";
import modal from "vue-js-modal";
export default defineComponent({
  setup() {
    return {};
  },
  components: {
    modal,
  },
  props: {
    Item: {
      type: Object as PropType<Item>,
      required: true,
    },
  },
  methods: {
    open(id: string) {
      console.log(id);
      console.log(this.$refs[`modal-${id}`]);
    },
  },
});
</script>

<style scoped></style>
