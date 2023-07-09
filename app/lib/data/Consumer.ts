export class Consumer {
  public readonly id: string;
  public readonly energyLoad: number;

  constructor(id: string, energyLoad: number) {
    this.id = id;
    this.energyLoad = energyLoad;
  }
}
