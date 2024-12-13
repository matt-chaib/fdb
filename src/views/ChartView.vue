<script setup lang="ts">
import Slider from '@/components/Slider.vue';
import Chart from '../components/Chart.vue'

import { usePointsStore } from '@/stores/points'; // Import the store
import FinancialAttributes from '@/components/FinancialAttributes.vue';
const pointStore = usePointsStore(); // Get the store instance

</script>

<template>
  <main>
    <div class="attributes">
      <FinancialAttributes />
    </div>
    <div>
      <Slider :pointsStore="pointStore" />
      <Chart :pointStore="pointStore"/>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: row;
}

.attributes {
  min-width: 300px;
}
</style>