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
            {{ tick/120 * 10 + ' years' }}
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
            {{ tick/1000 + 'k' }}
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
        v-for="(point, i) in totalAssets"
  :key="'point-' + i"
  :cx="scaleX(point.x)"
  :cy="scaleY(point.y)"
  :r="isHoveredRadius(i)" 
  :fill="isHoveredFill(i)" 
  @mouseenter="handleMouseEnter(i)"
  @mouseleave="handleMouseLeave"
        />
        <circle
        v-for="(point, i) in savings"
  :key="'point-' + i"
  :cx="scaleX(point.x)"
  :cy="scaleY(point.y)"
  :r="'3px'" 
  :fill="'blue'" 
        />     
      </svg>
    </div>
    <div>
      SavingsPercent
      <input
          type="number"
          v-model.number="savingsPercent"
          :min="0"
          style="width: 60px;"
        />
        Xmin
        <input
          type="number"
          v-model.number="minX"
          style="width: 60px;"
        />
        xMax
        <input
          type="number"
          v-model.number="maxX"
          style="width: 60px;"
        />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch} from "vue";
  const hoveredPoint = ref<number | null>(null); // Stores the index of the hovered point

  import { defineProps } from 'vue';

    import type { PointStore } from '@/stores/pointStore';

    let {pointStore} = defineProps<{
      pointStore: PointStore;
    }>();

    let savingsPercent = ref<number>(0.2);

    let minX = ref<number>(0);
    let maxX = ref<number>(1000);


  console.log(hoveredPoint)
  
  // Define types for data points
  interface DataPoint {
    x: number;
    y: number;
  }

  function handleMouseEnter(index: number) {
    console.log(index, totalAssets.value[index].y)
  hoveredPoint.value = index;
}

function isHoveredFill(index: number) {
    return(index === hoveredPoint.value ? 'red' : 'blue')
}

function isHoveredRadius(index: number) {
   return(index === hoveredPoint.value ? 5 : 3)
}

function handleMouseLeave() {
  hoveredPoint.value = null;
}
  
  // Chart dimensions and padding
  const chartWidth = 600;
  const chartHeight = 400;
  const padding = 50;
  
// Sample data points
const totalAssets = ref<DataPoint[]>([]);

const savings = ref<DataPoint[]>([]);

const incomeLevel = computed(() => {
  return pointStore.points.map(point => ({
    x: point.x,
    amount: point.value,
    recurring: point.recurring,
    type: point.type
  }));
});

// Watch for changes in pointStore to update the graph
watch(() => pointStore.points, () => {
  console.log("updating")
  updateData();
}, { deep: true });

watch(() => savingsPercent, () => {
  console.log("updating")
  updateData();
}, { deep: true });

// Function to update the data array based on points
function updateData() {
  let assets: number = 0;
  let currentIncome: number = 0;
  let currentSpending: number = 0;
  let income: number = 0;
  let currentSaving: number = 0;
  let savingsInterest: number = 0;
  let savingsInterestPercent: number = 0.001;

  // Update the data array with new values
  totalAssets.value = totalAssets.value.map((row, index) => {
    const incomeEntry = incomeLevel.value.find((level) => level.x === row.x);
    if (incomeEntry && incomeEntry.type === "expense") incomeEntry.amount = -1 * incomeEntry.amount
    if (incomeEntry && incomeEntry.type === "income") currentIncome = incomeEntry.recurring ? incomeEntry.amount : currentIncome;
    if (incomeEntry && incomeEntry.type === "expense") currentSpending = incomeEntry.recurring ? incomeEntry.amount : currentSpending;

    income = currentIncome + currentSpending;
    savings.value[index].y = currentSaving + (income * savingsPercent.value);
    savingsInterest = savings.value[index].y * savingsInterestPercent
    income += savingsInterest;
    // Update assets and return updated point
    assets += income;
    currentSaving = currentSaving + (income * savingsPercent.value);
    if (incomeEntry && !incomeEntry.recurring) assets += incomeEntry.amount;
    if (assets < savings.value[index].y) {
      savings.value[index].y = assets
      currentSaving = assets
    }
    return { x: row.x, y: assets };
  });
}

// Sample data points (initialize if no data)
if (totalAssets.value.length === 0) {
  let i: number = 0;
  for (i; i < 1000; i++) {
    totalAssets.value.push({ x: i, y: 0 });
    savings.value.push({ x: i, y: 0 });
  }
}


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
  const xTicks: number[] =  generateTicks(1000,120);
  const yTicks = computed<number[]>(() => generateTicks(1000000,50000));
  

  // Create scaling functions
  const scaleX = computed<((x: number) => number)>(() => {
    console.log(minX.value, maxX.value)
    return (x: number) =>
      padding + ((x - minX.value) / (maxX.value - minX.value)) * (chartWidth - 2 * padding);
  });
  
  const scaleY = computed<((y: number) => number)>(() => {
    const minY = 0;
    const maxY = 1000000; // Math.max(...data.value.map((d) => d.y));
    return (y: number) =>
      chartHeight -
      padding -
      ((y - minY) / (maxY - minY)) * (chartHeight - 2 * padding);
  });
  
  // Compute line points for connecting lines
  const linePoints = computed<string>(() =>
    totalAssets.value
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
  