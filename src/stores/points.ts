import { defineStore } from 'pinia';
import type { Point } from '@/types/Point';

export const usePointsStore = defineStore('points', {
  state: () => ({
    points: [
      {name: "First job",x: 240, value: 1000, recurring: true, type: "income"}, 
      {name: "Rent, bills, food", x: 264, value: 800, recurring: true, type: "expense"}, 
      {name: "First job",x: 12 * 28, value: 2000, recurring: true, type: "income"}, 
      {name: "House deposit", x: 12 * 35, value: 35000, recurring: false, type: "expense"},
      {name: "Mortage and bills", x: 12 * 35, value: 1200, recurring: true, type: "expense"},
      {name: "Bills", x: 12 * 60, value: 500, recurring: true, type: "expense"}, 
      {name: "Pension", x: 12 * 67, value: 500, recurring: true, type: "income"}
    ] as Point[], // The array to store incomes
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
