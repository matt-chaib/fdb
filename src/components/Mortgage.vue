<script setup lang="ts">
    import { ref, computed } from 'vue';
    let principal = ref<number>(200000);
    let annual_rate = ref<number>(0.065);
    let years = ref<number>(30)
    let deposit = ref<number>(20000);

    let monthly_payment = computed(() => {
  let r = annual_rate.value / 12; // Monthly interest rate
  let n = years.value * 12; // Total number of payments
  return (r * (principal.value-deposit.value) * ((1 + r) ** n)) / (((1 + r) ** n) - 1);
});
</script>

<template>
     <label>
        House value
        <input
          type="number"
          v-model.number="principal"
          :min="0"
          :style="{width: '150px', padding: '0.2rem'}"
        />
      </label>
      <label>
        Annual interest rate
        <input
          type="number"
          v-model.number="annual_rate"
          :min="0"
          :style="{width: '150px', padding: '0.2rem'}"
        />
      </label>
      <label>
        Duration of loan (years)
        <input
          type="number"
          v-model.number="years"
          :min="0"
          :style="{width: '150px', padding: '0.2rem'}"
        />
      </label>
      <label>
        Deposit size
        <input
          type="number"
          v-model.number="deposit"
          :min="0"
          :style="{width: '150px', padding: '0.2rem'}"
        />
      </label>
      <p>{{ monthly_payment.toFixed(2)}}</p>
</template>