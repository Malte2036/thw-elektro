import { Position } from "../Position";
import { ElectroInterface } from "./Electro";

export class Consumer extends ElectroInterface {
  public readonly energyConsumption: number;
  public hasEnergy: boolean = false;
  public totalVoltageDrop: number | undefined = undefined;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    energyConsumption: number,
    templateId: string | undefined
  ) {
    super(id, name, position, "Consumer", templateId);

    this.energyConsumption = energyConsumption;
  }
}
