import { Position } from "../Position";
import { ElectroInterfaceWithInputPlug } from "./Electro";
import { Plug } from "./Plug";

export class Consumer extends ElectroInterfaceWithInputPlug {
  public readonly energyConsumption: number;
  public hasEnergy: boolean = false;
  public totalVoltageDrop: number | undefined = undefined;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    energyConsumption: number,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) {
    super(id, name, position, "Consumer", templateId, inputPlug);

    this.energyConsumption = energyConsumption;
  }
}
