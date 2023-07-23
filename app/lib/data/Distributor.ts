import { Position } from "../Position";
import { ElectroInterface } from "./Electro";

export class Distributor extends ElectroInterface {
  public energyFlow: number = 0;
  public hasEnergy: boolean = false;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    templateId: string | undefined
  ) {
    super(id, name, position, "Distributor", templateId);
  }
}
