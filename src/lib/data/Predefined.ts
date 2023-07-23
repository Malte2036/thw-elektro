import { ElectroType } from "./Electro";
import { Plug } from "./Plug";

export type Predefined = {
  id: string;
  type: ElectroType;
  name: string | undefined;
  defaultPlug: Plug | undefined;
  energyConsumption?: number;
  energyProduction?: number;
};
