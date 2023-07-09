export type CableLength = 25 | 50 | 75 | 100;

export class Cable {
  public readonly id: string;
  public readonly length: CableLength;

  constructor(id: string, length: CableLength) {
    this.id = id;
    this.length = length;
  }
}
