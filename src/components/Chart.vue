<template>
    <div id="chart-container">
      <!-- Chart SVG -->
      <svg
        :width="chartWidth"
        :height="chartHeight"
        style="border: 1px solid #ddd;"
      >
        <!-- X Axis Line -->
        <line
          x1="0"
          :y1="chartHeight - padding"
          :x2="chartWidth"
          :y2="chartHeight - padding"
          stroke="black"
        />
        <!-- Y Axis Line -->
        <line
          :x1="padding"
          y1="0"
          :x2="padding"
          :y2="chartHeight"
          stroke="black"
        />
        <!-- X Axis Ticks -->
        <g v-for="(tick, i) in xTicks" :key="'x-tick-' + i">
          <line
            :x1="scaleX(tick)"
            :y1="chartHeight - padding"
            :x2="scaleX(tick)"
            :y2="chartHeight - padding + 10"
            stroke="black"
          />
          <text
            :x="scaleX(tick)"
            :y="chartHeight - padding + 20"
            text-anchor="middle"
            font-size="12"
          >
            {{ tick }}
          </text>
        </g>
        <!-- Y Axis Ticks -->
        <g v-for="(tick, i) in yTicks" :key="'y-tick-' + i">
          <line
            :x1="padding"
            :y1="scaleY(tick)"
            :x2="padding - 10"
            :y2="scaleY(tick)"
            stroke="black"
          />
          <text
            :x="padding - 15"
            :y="scaleY(tick) + 5"
            text-anchor="end"
            font-size="12"
          >
            {{ tick }}
          </text>
        </g>
        <polyline
          :points="linePoints"
          fill="none"
          stroke="blue"
          stroke-width="2"
        />
        <!-- Data Points -->
        <circle
        v-for="(point, i) in data"
  :key="'point-' + i"
  :cx="scaleX(point.x)"
  :cy="scaleY(point.y)"
  :r="isHoveredRadius(i)" 
  :fill="isHoveredFill(i)" 
  @mouseenter="handleMouseEnter(i)"
  @mouseleave="handleMouseLeave"
        />      
      </svg>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from "vue";
  const hoveredPoint = ref<number | null>(null); // Stores the index of the hovered point
  console.log(hoveredPoint)
  // Define types for data points
  interface DataPoint {
    x: number;
    y: number;
  }

    // Define types for data points
    interface IncomeVariable {
    x: number;
    amount: number;
  }


  function handleMouseEnter(index: number) {
    console.log(index, hoveredPoint.value)
  hoveredPoint.value = index;
}

function isHoveredFill(index: number) {
    console.log("isHoevered", index, hoveredPoint.value)
    return(index === hoveredPoint.value ? 'red' : 'blue')
}

function isHoveredRadius(index: number) {
   return(index === hoveredPoint.value ? 10 : 7)
}

function handleMouseLeave() {
  hoveredPoint.value = null;
}
  
  // Chart dimensions and padding
  const chartWidth = 600;
  const chartHeight = 400;
  const padding = 50;
  
// Sample data points
const data = ref<DataPoint[]>([]);

// Initialize data with x values from 0 to 11
let i: number = 0;
for (i; i < 12; i++) {
  data.value.push({ x: i, y: 0 });
}

// Define earnings ref, if needed later
const earnings = ref<DataPoint[]>([]);

// Declare the ref with the correct type
const incomeLevel = ref<IncomeVariable[]>([
  { x: 2, amount: 200 },
  { x: 7, amount: 250 },
]);

const spendingLevel = ref<IncomeVariable[]>([
  { x: 4, amount: -150 },
]);

// Declare variables for income and savings
let savings: number = 0;
let currentIncome: number = 0;
let currentSpending: number = 0;
let income: number = 0;

// Iterate over the data array to update the y values with savings
data.value = data.value.map((row) => {
  // Find the income for the current x, default to 0 if not found
  const incomeEntry = incomeLevel.value.find((level) => level.x === row.x);
  const spendingEntry = spendingLevel.value.find((level) => level.x === row.x);
  if (incomeEntry) {
    currentIncome = incomeEntry.amount;
  }
  if (spendingEntry) {
    currentSpending = spendingEntry.amount;
  }

  income = currentIncome + currentSpending

  // Add the income to savings
  savings += income;

  // Return the updated object with x and y values
  return { x: row.x, y: savings };
});

console.log(data.value);


// Function to generate ticks based on the maximum y value and the interval
const generateTicks = (maxY: number, interval: number): number[] => {
  // Calculate the number of ticks needed based on the interval
  const ticks: number[] = [];
  let currentTick = 0;

  // Generate ticks starting from 0 up to the nearest multiple of interval that's >= maxY
  while (currentTick <= maxY) {
    ticks.push(currentTick);
    currentTick += interval;
  }
  console.log(ticks)
  return ticks;
};

  
  // Compute X and Y ticks
  const xTicks = computed<number[]>(() => data.value.map((d) => d.x));
  const yTicks = computed<number[]>(() => generateTicks(Math.max(...data.value.map((d) => d.y)), 100));
  
  // Create scaling functions
  const scaleX = computed<((x: number) => number)>(() => {
    const minX = Math.min(...data.value.map((d) => d.x));
    const maxX = Math.max(...data.value.map((d) => d.x));
    return (x: number) =>
      padding + ((x - minX) / (maxX - minX)) * (chartWidth - 2 * padding);
  });
  
  const scaleY = computed<((y: number) => number)>(() => {
    const minY = 0;
    const maxY = Math.max(...data.value.map((d) => d.y));
    return (y: number) =>
      chartHeight -
      padding -
      ((y - minY) / (maxY - minY)) * (chartHeight - 2 * padding);
  });
  
  // Compute line points for connecting lines
  const linePoints = computed<string>(() =>
    data.value
      .map((point) => `${scaleX.value(point.x)},${scaleY.value(point.y)}`)
      .join(" ")
  );

  
  </script>
  
  <style scoped>
  #chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }
  </style>
  