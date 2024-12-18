<script setup lang="ts">
import { usePointsStore } from '@/stores/attributeStore';
let pointsStore = usePointsStore()
const convert_months_to_years = (months: number) => {
  let years = Math.floor(months / 12)
  let months_remainder = months % 12
  return(`${years} years ${months_remainder} months`)
}
import { sliderColors } from '@/utils/colours';
</script>

<template>
  <div class="attributes-container">
    <div v-for="(point, index) in pointsStore.points" :key="'input-' + index" class="attribute-container" :style="{padding: '0.3rem', borderRadius: '5px'}">
      <label>
        <input
          type="String"
          v-model.number="point.name"
          :min="0"
          :style="{border: `2px solid ${sliderColors[index]}`, width: '150px', padding: '0.2rem'}"
        />
      </label>

        <label>
        Point {{ index + 1 }}: X = {{ convert_months_to_years(point.x) }},
        </label>
      

        <label>
        Value: 
        <input
          type="number"
          v-model.number="point.value"
          :min="0"
          style="width: 60px;"
        />
      </label>

      <label>
        Recurring:
        <input
          type="checkbox"
          v-model.boolean="point.recurring"
          style="width: 60px;"
        />
      </label>

      <label>
        Income Type:
        <select id="store-type" v-model="point.type">
      <option value="income">Income</option>
      <option value="expense">Expense</option>
      </select>
      </label>
    </div>
  </div>
</template>

<style scoped>

.attributes-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.attribute-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.attribute-container label {

}


</style>