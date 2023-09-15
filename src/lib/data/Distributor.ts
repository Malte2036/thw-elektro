import { Position } from "../Position";
import { calculatePowerInWatt } from "../calculation/energy";
import { ElectroInterfaceWithInputPlug } from "./Electro";
import { Plug } from "./Plug";

export class Distributor extends ElectroInterfaceWithInputPlug {
  public energyFlow: number = 0;
  public hasEnergy: boolean = false;
  public apparentPower: number | undefined = undefined;

  public get allowedEnergyFlow(): number {
    return calculatePowerInWatt(this.inputPlug);
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
