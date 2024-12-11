import { defineStore } from 'pinia';
import type { Point } from '@/types/Point';

export const usePointsStore = defineStore('points', {
  state: () => ({
    points: [] as Point[], // The array to store points
  }),
  actions: {
    addPoint() {
      // Add a new point to the array
      this.points.push({ x: 0, value: 0 });
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
