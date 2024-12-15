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
            {{ Math.floor(tick/1000) + 'k' }}
          </text>
        </g>
        <polyline
          :points="linePoints"
          fill="none"
          stroke="blue"
          stroke-width="2"
        />
        <polyline
          :points="freeCashLine"
          fill="none"
          stroke="yellow"
          stroke-width="2"
        />
        <polyline
          :points="savingsLine"
          fill="none"
          stroke="navy"
          stroke-width="2"
        />
        <!-- Data Points -->
        <circle
        v-for="(point, i) in totalAssetsReduced"
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
    <p>Time to reach 100k: {{ onehk ? (onehk.x / 12) : 0 }} years.</p>
    <p>Time to reach 300k: {{ threehk ? (threehk.x / 12): 0 }} years.</p>
    <p>Wealth at 80 years: £{{ wealth80 }}</p>

  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch} from "vue";
  const hoveredPoint = ref<number | null>(null); // Stores the index of the hovered point

  import { defineProps } from 'vue';

    import type { PointStore } from '@/stores/pointStore';
    import { useAxisStore } from '@/stores/xaxis';
    const axisStore = useAxisStore();


    let {pointStore} = defineProps<{
      pointStore: PointStore;
    }>();

    let savingsPercent = ref<number>(0.2);

    let minX = ref<number>(0);
    let maxX = ref<number>(1000);
    axisStore.updateAxis(minX.value, maxX.value)

    watch([minX, maxX], ([newMinX, newMaxX]) => {
  axisStore.updateAxis(newMinX, newMaxX);
});

  console.log(hoveredPoint)
  
  // Define types for data points
  interface DataPoint {
    x: number;
    y: number;
  }

  function handleMouseEnter(index: number) {
    console.log(totalAssetsReduced.value[index].x/12, totalAssetsReduced.value[index].y)
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

const freeCash = ref<DataPoint[]>([]);

const financialChange = computed(() => {
  return pointStore.points.map(point => ({
    x: point.x,
    amount: point.value,
    recurring: point.recurring,
    type: point.type
  }));
});

// Watch for changes in pointStore to update the graph
watch(() => pointStore.points, () => {
  updateData();
}, { deep: true });

watch(() => savingsPercent, () => {
  updateData();
}, { deep: true });

// Function to update the data array based on points
function updateData() {
  let assets: number = 0;
  let currentIncome: number = 0;
  let currentSpending: number = 0;
  let income: number = 0;
  let currentFreeCash: number = 0;
  let currentSaving: number = 0;
  let savingsInterest: number = 0;
  let savingsInterestPercent: number = 0.001;
  totalAssets.value = totalAssets.value.map(row => { return ({x: row.x, y: 0})})
  savings.value = savings.value.map(row => { return ({x: row.x, y: 0})})

  // Update the data array with new values
  totalAssets.value = totalAssets.value.map((row, index) => {
    const financialChanges = financialChange.value.filter((change) => change.x === row.x);

    let nonRecurringIncome = 0;
    let nonRecurringSpend = 0;

    financialChanges.forEach(change => {
      if (change && change.type === "income")  change.recurring ? currentIncome =  change.amount : nonRecurringIncome = change.amount;
      if (change && change.type === "expense") change.recurring ? currentSpending =  change.amount : nonRecurringSpend = change.amount;
    })
    savings.value[index].y = currentSaving + (income * savingsPercent.value);

    savingsInterest = savings.value[index].y * savingsInterestPercent
    savings.value[index].y += savingsInterest

    // Update assets and return updated point
    income = currentIncome - currentSpending;
    assets += income;
    assets += savingsInterest;
    assets += nonRecurringIncome;
    assets -= nonRecurringSpend;
    currentSaving += nonRecurringIncome

    currentSaving = currentSaving + (income * savingsPercent.value);
    currentFreeCash = currentFreeCash + income - nonRecurringSpend - (income * savingsPercent.value)
    freeCash.value[index].y = currentFreeCash;

    currentSaving = currentSaving + savingsInterest;
    if (freeCash.value[index].y <= 0) {
      savings.value[index].y += freeCash.value[index].y
      currentSaving = savings.value[index].y
      currentFreeCash = 0;
    }
    // console.log (
    //   "freeCash: ", freeCash.value[index].y,
    //   "savings: ", savings.value[index].y,
    //   "total assets: ", assets,
    //   "sum: ", freeCash.value[index].y + savings.value[index].y
    // )
    return { x: row.x, y: assets };
  });
}

// Sample data points (initialize if no data)
if (totalAssets.value.length === 0) {
  let i: number = 0;
  for (i; i < 1000; i++) {
    totalAssets.value.push({ x: i, y: 0 });
    savings.value.push({ x: i, y: 0 });
    freeCash.value.push({ x: i, y: 0 });
  }
}


updateData()

// Function to generate ticks based on the maximum y value and the interval
const generateTicks = (maxY: number, axis: String): number[] => {
  // Calculate the number of ticks needed based on the interval
  const ticks: number[] = [];
  let currentTick = 0;
  let interval = 0;

  if (axis === "y"){
  if (maxY > 250000) interval = 50000
  if (maxY > 100000 && maxY < 250000) interval = 25000
  if (maxY < 100000) interval = 5000
  if (maxY < 25000) interval = 1000
  }
 
  if (axis === "x") {
    interval = 120
  }
  // Generate ticks starting from 0 up to the nearest multiple of interval that's >= maxY
  while (currentTick <= maxY) {
    ticks.push(currentTick);
    currentTick += interval;
  }
  console.log(ticks)
  return ticks;
};

  
  // Compute X and Y ticks
  const xTicks: number[] =  generateTicks(1000, "x");
  const yTicks = computed<number[]>(() => {
    console.log("maxX value", (totalAssets.value.find(row => row.x === maxX.value)?.y || 1000000))
    return generateTicks((totalAssets.value.find(row => row.x === maxX.value)?.y || 1000000), "y")
  });
  

  // Create scaling functions
  const scaleX = computed<((x: number) => number)>(() => {
    console.log(minX.value, maxX.value)
    return (x: number) =>
      padding + ((x - minX.value) / (maxX.value - minX.value)) * (chartWidth - 2 * padding);
  });
  
  const scaleY = computed<((y: number) => number)>(() => {
    const minY = totalAssets.value.find(row => row.x === minX.value)?.y || 0;
    const maxY = totalAssets.value.find(row => row.x === maxX.value)?.y || 1000000; // Math.max(...data.value.map((d) => d.y));
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

  const freeCashLine = computed<string>(() =>
    freeCash.value
      .map((point) => `${scaleX.value(point.x)},${scaleY.value(point.y)}`)
      .join(" ")
  );

  const savingsLine = computed<string>(() =>
    savings.value
      .map((point) => `${scaleX.value(point.x)},${scaleY.value(point.y)}`)
      .join(" ")
  );

  const totalAssetsReduced = computed<DataPoint[]>(() => {
    let reducedOutput: DataPoint[] = [];
   totalAssets.value.forEach((row, index) => {
    if (row.x % 12 ===0) {
      reducedOutput.push(row)
    }
   })
   return reducedOutput
  })

  const onehk = computed(() => {
  const point = totalAssets.value.find(row => row.y > 100000);
  return point ? point : null; // Return `null` if no match
});

const threehk = computed(() => {
  const point = totalAssets.value.find(row => row.y > 300000);
  return point ? point : null;
});

const wealth80 = computed(() => {
  const point = totalAssets.value.find(row => row.x === 12 * 80);
  return point ? new Intl.NumberFormat('en-US').format(point.y.toFixed(2)) : 0; // Return 0 if no match
});
  
  </script>
  
  <style scoped>
  #chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }
  </style>
  