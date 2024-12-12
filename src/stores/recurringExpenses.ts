import { defineStore } from 'pinia';
import type { Point } from '@/types/Point';

export const useExpensesStore = defineStore('expenses', {
  state: () => ({
    expenses: [{x: 7, value: 20, recurring: true}] as Point[], // The array to store expenses
  }),
  getters: {
    points: (state) => state.expenses, // Alias for points
  },
  actions: {
    addPoint() {
      this.expenses.push({ x: 0, value: 0, recurring: false });
    },
    updatePoint(index: number, newPoint: Point) {
      this.expenses[index] = newPoint;
    },
    removePoint(index: number) {
      this.expenses.splice(index, 1);
    },
  },
});
