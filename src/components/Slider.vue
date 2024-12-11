<template>
    <div :style="{marginLeft: '60px'}">
      <!-- Button to add a point -->
      <button @click="addPoint">Add Point</button>
  
      <!-- Horizontal line where points will be placed -->
      <div
        class="line"
        :style="{ width: chartWidth-60 + 'px', height: '10px', position: 'relative', background: '#ddd' }"
      >
        <!-- Render each point -->
        <div
          v-for="(point, index) in points"
          :key="index"
          class="point"
          :style="{
            left: `${point.x * ((chartWidth-60) / maxX)}px`,  // Scale the x value to fit within the chart width
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
  
      <!-- Display the current x value for each point -->
      <div v-for="(point, index) in points" :key="'label-' + index">
        Point {{ index + 1 }}: x = {{ point.x }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Point {
    x: number;
  }
  
  const chartWidth = 600; // Width of the horizontal line
  const maxX = 12; // Maximum value for x
  const points = ref<Point[]>([]); // Store the points added by the user
  
  let isDragging = false;
  let draggedIndex = -1;
  
  // Add a new point at a default position
  const addPoint = () => {
    points.value.push({ x: 0 }); // Start all points at x = 0
  };
  
  // Start dragging the point
  const startDrag = (index: number, event: MouseEvent) => {
    draggedIndex = index;
    isDragging = true;
    // Capture initial mouse position
    const startX = event.clientX;
    const startPointX = points.value[index].x;
  
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (isDragging && draggedIndex >= 0) {
        const deltaX = moveEvent.clientX - startX;
        // Calculate the new x position and snap it to the nearest whole number
        let newX = startPointX + (deltaX * maxX) / chartWidth;
        newX = Math.round(newX); // Snap to the nearest whole number
        // Constrain the x value between 0 and maxX (12)
        points.value[draggedIndex].x = Math.min(Math.max(0, newX), maxX);
      }
    };
  
    const onMouseUp = () => {
      isDragging = false;
      draggedIndex = -1;
      // Remove the event listeners when dragging stops
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  
    // Add event listeners for mouse movement and mouse release
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  </script>
  
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
  