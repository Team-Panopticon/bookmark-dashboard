<template>
  <div class="tooltip-container">
    <div class="slot-container">
      <slot />
    </div>
    <div class="tooltip">
      <span class="text">{{ text }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.slot-container {
  width: 100%;
}
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-container:hover .tooltip {
  opacity: 0.85;

  transition: opacity;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-delay: 1000ms;
}

.tooltip {
  top: 108%;
  left: 40px;
  color: #ffffff;
  text-align: center;
  border-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.6;
  min-width: 100%;
  max-width: 200%;
  padding: 4px;
  pointer-events: none;
  transition-property: opacity, transform;
  word-wrap: break-word;
  opacity: 0;
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  transition-duration: 75ms;
  position: absolute;
  z-index: 1000;
  transform: translateX(-50%);
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
</style>
