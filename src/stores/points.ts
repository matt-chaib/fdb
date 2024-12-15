import { defineStore } from 'pinia';
import type { Point } from '@/types/Point';

export const usePointsStore = defineStore('points', {
  state: () => ({
    points: [{x: 240, value: 1000, recurring: true, type: "income"}, {x: 264, value: 500, recurring: true, type: "expense"}] as Point[], // The array to store incomes
  }),
  actions: {
    addPoint() {
      // Add a new point to the array
      this.points.push({ x: 0, value: 0, recurring: false, type: "income" });
    },
    updatePoint(index: number, newPoint: Point) {
      // Update the point at the given index
      this.points[index] = newPoint;
    },
    removePoint(index: number) {
      // Remove the point at the given index
      this.points.splice(index, 1);
    },
  },
});
