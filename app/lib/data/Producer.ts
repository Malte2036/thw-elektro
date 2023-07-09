export class Producer {
  public readonly id: string;
  public readonly energyProduction: number;

  constructor(id: string, energyProduction: number) {
    this.id = id;
    this.energyProduction = energyProduction;
  }
}
