import Dexie, { Table } from "dexie";
import { Predefined } from "../data/Predefined";

export class MySubClassedDexie extends Dexie {
  predefined!: Table<Predefined>;

  constructor() {
    super("elektroDatabase");
    this.version(2).stores({
      predefined: "id, type, name, energyConsumption",
    });
  }
}

export const db = new MySubClassedDexie();
