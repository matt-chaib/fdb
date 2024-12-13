<script setup>
import { usePointsStore } from '@/stores/points';
let pointsStore = usePointsStore()
</script>

<template>
     <div v-for="(point, index) in pointsStore.points" :key="'input-' + index" style="margin-top: 10px;">
      <label>
        Point {{ index + 1 }}:
        X = {{ point.x }},
        Recurring = {{ point.recurring }}
        Value: 
        <input
          type="number"
          v-model.number="point.value"
          :min="0"
          style="width: 60px;"
        />

        <input
          type="boolean"
          v-model.boolean="point.recurring"
          style="width: 60px;"
        />

        <select id="store-type" v-model="point.type">
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
      </label>
    </div>
</template>