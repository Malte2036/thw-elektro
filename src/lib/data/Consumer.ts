import { Position } from "../Position";
import { COS_PHY, ElectroInterfaceWithInputPlug } from "./Electro";
import { Plug } from "./Plug";

export class Consumer extends ElectroInterfaceWithInputPlug {
  public readonly energyConsumption: number;
  /**
   * @returns Nennleistung in A
   */
  public readonly ratedPower: number | undefined = undefined;

  public hasEnergy: boolean = false;
  public totalVoltageDrop: number | undefined = undefined;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    energyConsumption: number,
    ratedPower: number | undefined,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) {
    super(id, name, position, "Consumer", templateId, inputPlug);

    this.energyConsumption = energyConsumption;
    this.ratedPower = ratedPower;
  }

  /**
   * S = U * I * Wurzel(3) * cos(phi)
   * @returns Scheinleistung in VA
   */
  public getApparentPower(): number {
    if (!this.ratedPower) return 0.0001; // change, it is 0.0001 do not destroy with old stored data

    return ((this.inputPlug.voltage * this.ratedPower) / 1000) * Math.sqrt(3);
  }

  /**
   * P = U * I * Wurzel(3) * cos(phi)
   * @returns Wirkleistung in VA
   */
  public getActivePower(): number {
    if (!this.ratedPower) return 0.0001; // change, it is 0.0001 do not destroy with old stored data

    return this.getApparentPower() * COS_PHY;
  }

  /**
   * B = U * I * Wurzel(3)
   * @returns Blindleistung in VA
   */
  // public getReactivePower(): number {
  //   if (!this.ratedPower) return 0.0001; // change, it is 0.0001 do not destroy with old stored data
  //
  //   return this.getApparentPower() * SIN_PHY;
  // }
}
