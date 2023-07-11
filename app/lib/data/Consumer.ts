export class Consumer {
  public readonly id: string;
  public readonly name: string | undefined;
  public readonly energyConsumption: number;

  constructor(id: string, name: string | undefined, energyConsumption: number) {
    this.id = id;
    this.name = name;
    this.energyConsumption = energyConsumption;
  }
}
