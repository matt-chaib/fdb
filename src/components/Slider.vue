<script setup lang="ts">
import { usePointsStore } from '@/stores/points'; // Import the store

const pointsStore = usePointsStore(); // Get the store instance

const addPoint = () => {
  pointsStore.addPoint(); // Add a new point through the store
};

// Start dragging the point
const startDrag = (index: number, event: MouseEvent) => {
  let isDragging = true;
  const startX = event.clientX;
  const startPointX = pointsStore.points[index].x;

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (isDragging) {
      const deltaX = moveEvent.clientX - startX;
      let newX = startPointX + (deltaX * 12) / 600; // Max value 12, chart width 600
      newX = Math.round(newX); // Snap to the nearest whole number
      pointsStore.updatePoint(index, { x: Math.min(Math.max(0, newX), 12), value: pointsStore.points[index].value });
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
</script>

<template>
  <div>
    <!-- Button to add a point -->
    <button @click="addPoint">Add Point</button>
    
    <!-- Render each point -->
    <div class="line" :style="{ width: '600px', height: '10px', background: '#ddd', position: 'relative' }">
      <div
        v-for="(point, index) in pointsStore.points"
        :key="index"
        class="point"
        :style="{
          left: `${point.x * (600 / 12)}px`,
          position: 'absolute',
          cursor: 'pointer',
          width: '20px',
          height: '20px',
          backgroundColor: 'red',
          borderRadius: '50%',
        }"
        @mousedown="startDrag(index, $event)"
      ></div>
    </div>

    <!-- Display and edit point values -->
    <div v-for="(point, index) in pointsStore.points" :key="'input-' + index" style="margin-top: 10px;">
      <label>
        Point {{ index + 1 }}:
        X = {{ point.x }},
        Value: 
        <input
          type="number"
          v-model.number="point.value"
          :min="0"
          style="width: 60px;"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
.line {
  background-color: #ddd;
  height: 10px;
  margin: 20px 0;
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
