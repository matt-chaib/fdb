<script setup lang="ts">

import { onMounted, computed } from 'vue';
import { sliderColors, hexToRgb } from '@/utils/colours';

import { defineProps } from 'vue';

import { useAxisStore } from '@/stores/xaxis';
import { useChartStore } from '@/stores/chartDimensions';
import { useAttributesStore } from '@/stores/attributeStore';
const axisStore = useAxisStore();
const chartStore = useChartStore();
const attributeStore = useAttributesStore();

const selectAttribute = (id: number) => {
  attributeStore.selectAttribute(id); // Update the selected attribute in the store
};

// Start dragging the attribute
const startDrag = (id: number, event: MouseEvent) => {
  let isDragging = true;
  const startX = event.clientX;
  const startPointX = attributeStore.findAttribute(id).x;

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (isDragging) {
      console.log("Point X", startPointX)
      console.log("start X", startX)
      const deltaX = moveEvent.clientX - startX;
      let newX = startPointX + (deltaX * 1000) / 600; // Max value 12, chart width 600
      newX = Math.round(newX); // Snap to the nearest whole number
      attributeStore.updateAttributeX(id, Math.min(Math.max(0, newX), 1000));
    }
  };

  const onMouseUp = () => {
    isDragging = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};
 
  // Create scaling functions
  const scaleX = computed<((x: number) => number)>(() => {
    console.log(axisStore.axis)
    return (x: number) =>
      chartStore.padding + ((x - axisStore.axis.min) / (axisStore.axis.max - axisStore.axis.min)) * (chartStore.width - 2 * chartStore.padding);
  });

  const attributesShown = computed(() => {
    return attributeStore.attributes

    if (attributeStore.selectedAttributeId) {
      return [attributeStore.findAttribute(attributeStore.selectedAttributeId)]
    } else {
      return attributeStore.attributes
    }
});

const getSelectedAttribute = computed(() => {
  return attributeStore.selectedAttributeId
    ? attributeStore.findAttribute(attributeStore.selectedAttributeId)
    : null;
});

const pointWidthLarge = 20
const pointWidthSmall = 10

</script>

<template>
  <div>
      <!-- Display and edit point values -->
     
    <!-- Button to add a point -->
    <button @click="attributeStore.addAttribute">Add Point</button>
    
    <!-- Render each point -->
    <div class="line" :style="{ width: '600px', height: '10px', background: '#ddd', position: 'relative', marginLeft: `${chartStore.padding}px`}">
      <div
        v-for="(point, index) in attributesShown"
        :key="point.id"
        class="point"
        :style="{
          left: `${scaleX(point.x) - chartStore.padding - pointWidthLarge/2}px`,
          bottom: '-5px',
          position: 'absolute',
          cursor: 'pointer',
          width: `${point.recurring ? `'${pointWidthLarge}px'` : `'${pointWidthSmall}px'`}`,
          height: `${point.recurring ? `'${pointWidthLarge}px'` : `'${pointWidthSmall}px'`}`,
          backgroundColor: attributeStore.selectedAttributeId === point.id || !attributeStore.selectedAttributeId
      ? sliderColors[point.id]
      : `rgba(${hexToRgb(sliderColors[point.id])}, 0.3)`,
          borderRadius: '50%',
          border: attributeStore.selectedAttributeId === point.id ? '2px solid black' : 'none',

        }"
        @mousedown="startDrag(point.id, $event)"
        @click="selectAttribute(point.id)"
      ></div>
      <div
        v-for="(point, index) in attributesShown"
        :key="point.id"
        class="line"
        :style="{
          left: `${scaleX(point.x) - chartStore.padding}px`,
          bottom: '-400px',
          position: 'absolute',
          cursor: 'pointer',
          width: '2px',
          height: '380px',
          backgroundColor: attributeStore.selectedAttributeId === point.id || !attributeStore.selectedAttributeId
      ? sliderColors[point.id]
      : `rgba(${hexToRgb(sliderColors[point.id])}, 0.3)`,
        }"
        @mousedown="startDrag(point.id, $event)"
      ></div>
      <div
        v-if="getSelectedAttribute && getSelectedAttribute.expires_at_x"
        class="shaded-rectangle"
        :style="{
          left: `${Math.min(scaleX(getSelectedAttribute.x), scaleX(getSelectedAttribute.expires_at_x)) - chartStore.padding}px`,
          width: `${Math.abs(scaleX(getSelectedAttribute.x) - scaleX(getSelectedAttribute.expires_at_x)) - 0}px`,
          top: '30px',
          position: 'absolute',
          height: '350px',
          backgroundColor: 'rgba(100, 149, 237, 0.3)', /* Semi-transparent blue */
        }"
      ></div>
        <!-- Render arrowhead at expires_at_x -->
        <div
    v-if="getSelectedAttribute && getSelectedAttribute.expires_at_x"
    :style="{
      position: 'absolute',
      left: `${scaleX(getSelectedAttribute.expires_at_x) - chartStore.padding}px`, // Adjust for position
      bottom: '-15px',
      fontSize: '30px',
      color: 'black',
    }"
  >
    &#x003C; <!-- Unicode for "<" -->
  </div>
    </div>
  </div>
</template>

<style scoped>
.line {
  background-color: #ddd;
  height: 10px;
}

.point {
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
}
</style>
