export class Consumer {
  public readonly id: string;
  public readonly energyConsumption: number;

  constructor(id: string, energyConsumption: number) {
    this.id = id;
    this.energyConsumption = energyConsumption;
  }
}
