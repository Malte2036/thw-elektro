import { Position } from "../Position";
import { ElectroInterfaceWithInputPlug } from "./Electro";
import { Plug } from "./Plug";

export class Distributor extends ElectroInterfaceWithInputPlug {
  public energyFlow: number = 0;
  public hasEnergy: boolean = false;

  public get allowedEnergyFlow(): number {
    return this.inputPlug.current * this.inputPlug.voltage;
  }

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) {
    super(id, name, position, "Distributor", templateId, inputPlug);
  }
}
