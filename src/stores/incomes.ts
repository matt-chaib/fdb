import { defineStore } from 'pinia';
import type { Point } from '@/types/Point';

export const useIncomeStore = defineStore('incomes', {
  state: () => ({
    incomes: [{x: 4, value: 50, recurring: true}] as Point[], // The array to store incomes
  }),
  getters: {
    points: (state) => state.incomes, // Alias for points
  },
  actions: {
    addPoint() {
      // Add a new point to the array
      this.incomes.push({ x: 0, value: 0, recurring: false });
    },
    updatePoint(index: number, newPoint: Point) {
      // Update the point at the given index
      this.incomes[index] = newPoint;
    },
    removePoint(index: number) {
      // Remove the point at the given index
      this.incomes.splice(index, 1);
    },
  },
});
