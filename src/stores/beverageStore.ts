import { defineStore } from "pinia";
import temperatures from "../data/temperatures.json";
import bases from "../data/bases.json"
import creamers from "../data/creamers.json"
import syrups from "../data/syrups.json"

// Define a type for beverage recipes
interface BeverageRecipe {
  name: string;
  temperature: string;
  base: typeof bases[0];
  creamer: typeof creamers[0];
  syrup: typeof syrups[0];
  isIced: boolean;
}

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: temperatures,
    currentTemp: temperatures[0],
    bases: bases,
    currentBase: bases[0],
    creamers: creamers,
    currentCreamer: creamers[0],
    syrups: syrups,
    currentSyrup: syrups[0],
    savedBeverages: [] as BeverageRecipe[],
  }),

  actions: {
    makeBeverage(name: string) {// Create a new beverage recipe from current selections
      const newBeverage: BeverageRecipe = {
        name: name,
        temperature: this.currentTemp,
        base: this.currentBase,
        creamer: this.currentCreamer,
        syrup: this.currentSyrup,
        isIced: this.currentTemp === 'Cold'
      };
      
      // Add it to savedBeverages array
      this.savedBeverages.push(newBeverage);
      return newBeverage;
    },
    showBeverage(bevIndex: number) {
      const beverage = this.savedBeverages[bevIndex];
    // Load the selected beverage's settings
      this.currentTemp = beverage.temperature;
      this.currentBase = beverage.base;
      this.currentCreamer = beverage.creamer;
      this.currentSyrup = beverage.syrup;
    },
    clearBeverages(){
      this.savedBeverages = [];
    }
  },
  persist: true,
});
