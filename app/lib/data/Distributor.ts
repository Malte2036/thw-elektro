import { Position } from "../Position";
import { ElectroInterface, ElectroInterfaceWithInputPlug } from "./Electro";
import { Plug } from "./Plug";

export class Distributor extends ElectroInterfaceWithInputPlug {
  public energyFlow: number = 0;
  public hasEnergy: boolean = false;

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
