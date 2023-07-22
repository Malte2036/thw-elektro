import { ElectroType } from "./Electro";

export type Predefined = {
  id: string;
  type: ElectroType;
  name?: string;
  energyConsumption?: number;
};
