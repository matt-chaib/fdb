import { defineStore } from 'pinia';

export const useAxisStore = defineStore('axis', {
  state: () => ({
    axis: {min: 0, max: 1000}, // The array to store incomes
  }),
  actions: {
    updateAxis(min: number, max: number) {
      // Update the point at the given index
      this.axis = {min, max}
    }
  },
});
