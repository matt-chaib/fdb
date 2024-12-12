<script setup lang="ts">
import Slider from '@/components/Slider.vue';
import Chart from '../components/Chart.vue'

import { usePointsStore } from '@/stores/points'; // Import the store
const pointStore = usePointsStore(); // Get the store instance

</script>

<template>
  <main>
    <Slider :pointsStore="pointStore" />
    <Chart :pointStore="pointStore"/>
  </main>
</template>
