import { Position } from "../Position";
import { COS_PHY, ElectroInterface } from "./Electro";

export class Producer extends ElectroInterface {
  public energyFlow: number = 0;
  public readonly energyProduction: number;
  public apparentPower: number | undefined = undefined;

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

  static fromJSON(json: Producer): Producer {
    return new Producer(
      json.id,
      json.name,
      json.position,
      json.templateId,
      json.energyProduction
    );
  }
}
