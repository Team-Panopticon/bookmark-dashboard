<template>
  <Transition>
    <div class="tooltip" v-if="tooltipShow">
      <span class="text">{{ tooltipText }}</span>
    </div>
  </Transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import {
  GET_TOOLTIP_POSITION,
  GET_TOOLTIP_SHOW,
  GET_TOOLTIP_TEXT,
} from "../store/modules/tooltip";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      tooltipPosition: GET_TOOLTIP_POSITION,
      tooltipText: GET_TOOLTIP_TEXT,
      tooltipShow: GET_TOOLTIP_SHOW,
    }),
    tooltipPositionPx() {
      return {
        x: `${this.tooltipPosition.x}px`,
        y: `${this.tooltipPosition.y}px`,
      };
    },
  },
});
</script>
<style scoped>
.tooltip {
  top: v-bind("tooltipPositionPx.y");
  left: v-bind("tooltipPositionPx.x");
  color: #ffffff;
  text-align: center;
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.6;
  min-width: 80px;
  max-width: 160px;
  padding: 4px;
  pointer-events: none;
  word-wrap: break-word;
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  transition-duration: 75ms;
  transform: translateX(-50%) translateX(40px) translateY(5px);
  position: fixed;
  z-index: 10000;
  background: gray;
}
.text {
  white-space: normal;
}
.text::after {
  content: " ";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent gray transparent;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.v-enter-active {
  transition-delay: 1000ms;
}
.v-enter-to,
.v-leave-from {
  opacity: 0.85;
}
</style>
