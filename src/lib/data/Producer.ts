import { Position } from "../Position";
import { COS_PHY, ElectroInterface } from "./Electro";

export class Producer extends ElectroInterface {
  public energyFlow: number = 0;
  public readonly energyProduction: number;

  public get allowedEnergyFlow(): number {
    return this.energyProduction * COS_PHY;
  }

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    templateId: string | undefined,
    energyProduction: number
  ) {
    super(id, name, position, "Producer", templateId);

    this.energyProduction = energyProduction;
  }
}
