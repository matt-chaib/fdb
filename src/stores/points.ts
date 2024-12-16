import { defineStore } from 'pinia';
import type { Point } from '@/types/Point';
export const usePointsStore = defineStore('points', {
  state: () => ({
    points: [
      { id: 1, name: "First job", x: 240, value: 1000, recurring: true, type: "income", expires_at_x: 12 * 80 },
      { id: 2, name: "Rent, bills, food", x: 264, value: 800, recurring: true, type: "expense", expires_at_x: 12 * 80 },
      { id: 3, name: "First job", x: 12 * 28, value: 2000, recurring: true, type: "income", expires_at_x: 12 * 80 },
      { id: 4, name: "House deposit", x: 12 * 35, value: 35000, recurring: false, type: "expense", expires_at_x: 12 * 80 },
      { id: 5, name: "Mortgage and bills", x: 12 * 35, value: 1200, recurring: true, type: "expense", expires_at_x: 12 * 80 },
      { id: 6, name: "Bills", x: 12 * 60, value: 500, recurring: true, type: "expense", expires_at_x: 12 * 80 },
      { id: 7, name: "Pension", x: 12 * 67, value: 500, recurring: true, type: "income", expires_at_x: 12 * 80 }
    ] as Point[], // The array to store incomes
    nextId: 8, // To generate unique IDs for new points
    selectedPointId: null as number | null, // ID of the selected point
  }),
  actions: {
    selectPoint(id: number) {
      if (this.selectedPointId === id) {
        this.selectedPointId = null;
      } else {
        this.selectedPointId = id;
      }
    },
    findPoint(id: number) {
      return this.points.find(point => point.id === id) || null;
    },
    addPoint() {
      // Add a new point with a unique ID and default expires_at_x
      this.points.push({
        id: this.nextId++,
        name: "",
        x: 0,
        value: 0,
        recurring: false,
        type: "income",
        expires_at_x: 12 * 80, // Default value
      });
    },
    updatePoint(id: number, newPoint: Point) {
      // Find the point by ID and update it
      const index = this.points.findIndex(point => point.id === id);
      if (index !== -1) {
        this.points[index] = { ...newPoint, id }; // Preserve the ID during update
      }
    },
    updatePointX(id: number, newX: number) {
      const point = this.findPoint(id);
      if (point) {
        point.x = newX;
      }
    },
    removePoint(id: number) {
      // Remove the point by ID
      this.points = this.points.filter(point => point.id !== id);
    },
  },
});
