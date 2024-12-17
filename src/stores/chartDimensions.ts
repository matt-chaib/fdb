import { defineStore } from 'pinia';

export const useChartStore = defineStore('chartDimensions', {
  state: () => ({
    width: 600,
    padding: 50,
    parentWidth: 600,
    height: 400,
  }),
});
