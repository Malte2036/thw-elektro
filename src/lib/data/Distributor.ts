import { Position } from "../Position";
import { calculatePowerInWatt } from "../calculation/energy";
import { Consumer } from "./Consumer";
import { ElectroInterface, ElectroInterfaceWithInputPlug } from "./Electro";
import { Plug } from "./Plug";

export class Distributor extends ElectroInterfaceWithInputPlug {
  public energyFlow: number = 0;
  public hasEnergy: boolean = false;

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

  /**
   * S = Wurzel ( (Summe Pi)² + (Summe Qi)² )
   * @returns Scheinleistung in VA
   */
  public getApparentPower(children: ElectroInterface[]): number {
    const consumerChildren = children.filter(
      (child) => child instanceof Consumer
    ) as Consumer[];

    const sumActivePower = consumerChildren.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.getActivePower(),
      0
    );
    const sumReactivePower = consumerChildren.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.getReactivePower(),
      0
    );

    return Math.sqrt(
      Math.pow(sumActivePower, 2) + Math.pow(sumReactivePower, 2)
    );
  }
}
