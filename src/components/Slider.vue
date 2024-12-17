<script setup lang="ts">

import { onMounted, computed } from 'vue';
import { sliderColors, hexToRgb } from '@/utils/colours';

import { defineProps } from 'vue';

import type { PointStore } from '@/stores/pointStore';
import { useAxisStore } from '@/stores/xaxis';
import { useChartStore } from '@/stores/chartDimensions';
const axisStore = useAxisStore();
const chartStore = useChartStore();

let {pointsStore} = defineProps<{
  pointsStore: PointStore;
}>();

const selectPoint = (id: number) => {
  pointsStore.selectPoint(id); // Update the selected point in the store
};

// Start dragging the point
const startDrag = (id: number, event: MouseEvent) => {
  let isDragging = true;
  const startX = event.clientX;
  const startPointX = pointsStore.findPoint(id).x;

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (isDragging) {
      console.log("Point X", startPointX)
      console.log("start X", startX)
      const deltaX = moveEvent.clientX - startX;
      let newX = startPointX + (deltaX * 1000) / 600; // Max value 12, chart width 600
      newX = Math.round(newX); // Snap to the nearest whole number
      pointsStore.updatePointX(id, Math.min(Math.max(0, newX), 1000));
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

  const pointsShown = computed(() => {
    return pointsStore.points

    if (pointsStore.selectedPointId) {
      return [pointsStore.findPoint(pointsStore.selectedPointId)]
    } else {
      return pointsStore.points
    }
});

const getSelectedPoint = computed(() => {
  return pointsStore.selectedPointId
    ? pointsStore.findPoint(pointsStore.selectedPointId)
    : null;
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
        v-for="(point, index) in pointsShown"
        :key="point.id"
        class="point"
        :style="{
          left: `${scaleX(point.x) - 123}px`,
          bottom: '-5px',
          position: 'absolute',
          cursor: 'pointer',
          width: `${point.recurring ? '20px' : '10px'}`,
          height: `${point.recurring ? '20px' : '10px'}`,
          backgroundColor: pointsStore.selectedPointId === point.id || !pointsStore.selectedPointId
      ? sliderColors[point.id]
      : `rgba(${hexToRgb(sliderColors[point.id])}, 0.3)`,
          borderRadius: '50%',
          border: pointsStore.selectedPointId === point.id ? '2px solid black' : 'none',

        }"
        @mousedown="startDrag(point.id, $event)"
        @click="selectPoint(point.id)"
      ></div>
      <div
        v-for="(point, index) in pointsShown"
        :key="point.id"
        class="line"
        :style="{
          left: `${scaleX(point.x) - 128}px`,
          bottom: '-400px',
          position: 'absolute',
          cursor: 'pointer',
          width: '2px',
          height: '380px',
          backgroundColor: pointsStore.selectedPointId === point.id || !pointsStore.selectedPointId
      ? sliderColors[point.id]
      : `rgba(${hexToRgb(sliderColors[point.id])}, 0.3)`,
        }"
        @mousedown="startDrag(point.id, $event)"
      ></div>
      <div
        v-if="getSelectedPoint && getSelectedPoint.expires_at_x"
        class="shaded-rectangle"
        :style="{
          left: `${Math.min(scaleX(getSelectedPoint.x), scaleX(getSelectedPoint.expires_at_x)) - 42}px`,
          width: `${Math.abs(scaleX(getSelectedPoint.x) - scaleX(getSelectedPoint.expires_at_x)) - 0}px`,
          top: '30px',
          position: 'absolute',
          height: '350px',
          backgroundColor: 'rgba(100, 149, 237, 0.3)', /* Semi-transparent blue */
        }"
      ></div>
        <!-- Render arrowhead at expires_at_x -->
        <div
    v-if="getSelectedPoint && getSelectedPoint.expires_at_x"
    :style="{
      position: 'absolute',
      left: `${scaleX(getSelectedPoint.expires_at_x) - 42}px`, // Adjust for position
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
