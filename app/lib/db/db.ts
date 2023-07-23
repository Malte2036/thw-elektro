import Dexie, { Table } from "dexie";
import { Predefined } from "../data/Predefined";

export class MySubClassedDexie extends Dexie {
  predefined!: Table<Predefined>;

  constructor() {
    super("elektroDatabase");
    this.version(3).stores({
      predefined:
        "id, type, name, defaultPlug, energyConsumption, energyProduction",
    });
  }
}

export const db = new MySubClassedDexie();
