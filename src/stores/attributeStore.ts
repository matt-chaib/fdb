import { defineStore } from 'pinia';
import type { Attribute } from '@/types/Attribute';
export const useAttributesStore = defineStore('attributes', {
  state: () => ({
    attributes: [
      { id: 1, name: "Job", controlPoints: [{x: 240, value: 1000}, {x: 480, value: 1500}], recurring: true, type: "income", expires_at_x: 12 * 80 },
      { id: 2, name: "Rent, bills, food", controlPoints: [{x: 264, value: 800}], recurring: true, type: "expense", expires_at_x: 12 * 80 },
      { id: 4, name: "House deposit", controlPoints: [{x: 12 * 35, value: 35000}], recurring: false, type: "expense", expires_at_x: 12 * 80 },
      { id: 5, name: "Mortgage and bills", controlPoints: [{x: 12 * 35, value: 1200}], recurring: true, type: "expense", expires_at_x: 12 * 80 },
      { id: 6, name: "Bills", controlPoints: [{x: 12 * 60, value: 500}], recurring: true, type: "expense", expires_at_x: 12 * 80 },
      { id: 7, name: "Pension", controlPoints: [{x: 12 * 67, value: 500}], recurring: true, type: "income", expires_at_x: 12 * 80 }
    ] as Attribute[], // The array to store incomes
    nextId: 8, // To generate unique IDs for new Attributes
    selectedAttributeId: null as number | null, // ID of the selected Attribute
    attributeTracks: {
    }
  }),
  actions: {
    initialiseTracks(minX: number, maxX: number) {
      this.attributes.forEach((attribute: Attribute) => {
        let trackValues = []
        let currentValue = 0;
        for (let i = minX; i < maxX; i++) {
          let previousValue = currentValue
          let cpValue = attribute.ControlPoints.find(point => point.x === i);
          if (cpValue) {
            currentValue = cpValue.value
            if (attribute.type === "expense") {
              currentValue = -currentValue
            }
          }
          trackValues.push({x: i, value: currentValue})
          if (!attribute.recurring) {
            currentValue = previousValue
          }
        }
        this.attributeTracks[attribute.id] = trackValues;
      })
    },
    selectAttribute(id: number) {
      if (this.selectedAttributeId === id) {
        this.selectedAttributeId = null;
      } else {
        this.selectedAttributeId = id;
      }
    },
    findAttribute(id: number) {
      return this.attributes.find(Attribute => Attribute.id === id) || null;
    },
    addAttribute() {
      // Add a new Attribute with a unique ID and default expires_at_x
      this.attributes.push({
        id: this.nextId++,
        name: "",
        x: 0,
        value: 0,
        recurring: false,
        type: "income",
        expires_at_x: 12 * 80, // Default value
      });
    },
    updateAttribute(id: number, newAttribute: Attribute) {
      // Find the Attribute by ID and update it
      const index = this.attributes.findIndex(Attribute => Attribute.id === id);
      if (index !== -1) {
        this.attributes[index] = { ...newAttribute, id }; // Preserve the ID during update
      }
    },
    updateAttributeX(id: number, newX: number) {
      const Attribute = this.findAttribute(id);
      if (Attribute) {
        Attribute.x = newX;
      }
    },
    removeAttribute(id: number) {
      // Remove the Attribute by ID
      this.attributes = this.attributes.filter(Attribute => Attribute.id !== id);
    },
  },
});
