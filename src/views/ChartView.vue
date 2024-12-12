<script setup lang="ts">
import Slider from '@/components/Slider.vue';
import Chart from '../components/Chart.vue'

import { useIncomeStore } from '@/stores/incomes'; // Import the store
const incomeStore = useIncomeStore(); // Get the store instance
import { useExpensesStore } from '@/stores/recurringExpenses';
const expenseStore = useExpensesStore();

</script>

<template>
  <main>
    <Slider :pointsStore="incomeStore" />
    <Slider :pointsStore="expenseStore" />
    <Chart :expenseStore="expenseStore" :incomeStore="incomeStore"/>
  </main>
</template>
