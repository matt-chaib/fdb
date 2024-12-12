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
  import { computed, ref, watch} from "vue";
  const hoveredPoint = ref<number | null>(null); // Stores the index of the hovered point

  import { defineProps } from 'vue';

    import type { PointStore } from '@/stores/pointStore';

    let {incomeStore, expenseStore} = defineProps<{
      incomeStore: PointStore;
      expenseStore: PointStore;
    }>();


  console.log("points", incomeStore.points)
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
    return(index === hoveredPoint.value ? 'red' : 'blue')
}

function isHoveredRadius(index: number) {
   return(index === hoveredPoint.value ? (maxX * 7 / (maxX - minX)) : (maxX * 4 / (maxX - minX)))
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

// Define earnings ref, if needed later
const earnings = ref<DataPoint[]>([]);

const incomeLevel = computed(() => {
  return incomeStore.points.map(point => ({
    x: point.x,
    amount: point.value,
    recurring: point.recurring
  }));
});


const spendingLevel= computed(() => {
  return expenseStore.points.map(point => ({
    x: point.x,
    amount: point.value,
    recurring: point.recurring
  }));
});

// Watch for changes in incomeStore to update the graph
watch(() => incomeStore.points, () => {
  console.log("updating")
  updateData();
}, { deep: true });

watch(() => expenseStore.points, () => {
  console.log("updating")
  updateData();
}, { deep: true });

// Function to update the data array based on points
function updateData() {
  let savings: number = 0;
  let currentIncome: number = 0;
  let currentSpending: number = 0;
  let income: number = 0;

  // Update the data array with new values
  data.value = data.value.map((row) => {
    const incomeEntry = incomeLevel.value.find((level) => level.x === row.x);
    const spendingEntry = spendingLevel.value.find((level) => level.x === row.x);
    
    if (incomeEntry) currentIncome = incomeEntry.recurring ? incomeEntry.amount : currentIncome;
    if (spendingEntry) currentSpending = spendingEntry.recurring ? -spendingEntry.amount : currentSpending;

    income = currentIncome + currentSpending;

    // Update savings and return updated point
    savings += income;
    if (incomeEntry && !incomeEntry.recurring) savings += incomeEntry.amount;
    if (spendingEntry && !spendingEntry.recurring) savings -= spendingEntry.amount;
    return { x: row.x, y: savings };
  });
}

// Sample data points (initialize if no data)
if (data.value.length === 0) {
  let i: number = 0;
  for (i; i < 100; i++) {
    data.value.push({ x: i, y: 0 });
  }
}

console.log(data.value);

updateData()

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
  const xTicks: number[] = Array.from({ length: 101 }, (_, i) => i);
  const yTicks = computed<number[]>(() => generateTicks(5000,500));
  

  const minX: number = 0;
  const maxX: number = 100;

  // Create scaling functions
  const scaleX = computed<((x: number) => number)>(() => {
    console.log(minX, maxX)
    return (x: number) =>
      padding + ((x - minX) / (maxX - minX)) * (chartWidth - 2 * padding);
  });
  
  const scaleY = computed<((y: number) => number)>(() => {
    const minY = 0;
    const maxY = 3000; // Math.max(...data.value.map((d) => d.y));
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
  