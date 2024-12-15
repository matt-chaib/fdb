<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { sliderColors } from '@/utils/colours';

import { defineProps } from 'vue';

import type { PointStore } from '@/stores/pointStore';
import { useAxisStore } from '@/stores/xaxis';
const axisStore = useAxisStore();

let {pointsStore} = defineProps<{
  pointsStore: PointStore;
}>();

// Start dragging the point
const startDrag = (index: number, event: MouseEvent) => {
  let isDragging = true;
  const startX = event.clientX;
  const startPointX = pointsStore.points[index].x;

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (isDragging) {
      const deltaX = moveEvent.clientX - startX;
      let newX = startPointX + (deltaX * 1000) / 600; // Max value 12, chart width 600
      newX = Math.round(newX); // Snap to the nearest whole number
      pointsStore.updatePoint(index, { x: Math.min(Math.max(0, newX), 1000), value: pointsStore.points[index].value, recurring: pointsStore.points[index].recurring, type: pointsStore.points[index].type, name: pointsStore.points[index].name});
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
  let padding = 50
  let chartWidth = 600
  // Create scaling functions
  const scaleX = computed<((x: number) => number)>(() => {
    console.log(axisStore.axis)
    return (x: number) =>
      padding + ((x - axisStore.axis.min) / (axisStore.axis.max - axisStore.axis.min)) * (chartWidth - 2 * padding);
  });



</script>

<template>
  <div>
      <!-- Display and edit point values -->
     
    <!-- Button to add a point -->
    <button @click="pointsStore.addPoint">Add Point</button>
    
    <!-- Render each point -->
    <div class="line" :style="{ width: '600px', height: '10px', background: '#ddd', position: 'relative' }">
      <div
        v-for="(point, index) in pointsStore.points"
        :key="index"
        class="point"
        :style="{
          left: `${scaleX(point.x) - 123}px`,
          bottom: '-5px',
          position: 'absolute',
          cursor: 'pointer',
          width: `${point.recurring ? '20px' : '10px'}`,
          height: `${point.recurring ? '20px' : '10px'}`,
          backgroundColor: sliderColors[index],
          borderRadius: '50%',
        }"
        @mousedown="startDrag(index, $event)"
      ></div>
      <div
        v-for="(point, index) in pointsStore.points"
        :key="index"
        class="line"
        :style="{
          left: `${scaleX(point.x) - 128}px`,
          bottom: '-470px',
          position: 'absolute',
          cursor: 'pointer',
          width: '2px',
          height: '450px',
          backgroundColor: sliderColors[index],
        }"
        @mousedown="startDrag(index, $event)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.line {
  background-color: #ddd;
  height: 10px;
  margin: 20px 0;
  margin-left: 85px;
}

.point {
  width: 20px;
  height: 20px;
  margin-left: 70px;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
}
</style>
