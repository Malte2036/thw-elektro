export type CableLength = 25 | 50 | 75 | 100;

export class Cable {
  public readonly id: string;
  public length: CableLength;

  constructor(id: string, length: CableLength) {
    this.id = id;
    this.length = length;
  }
}

export function getNextCableLength(length: CableLength): CableLength {
  switch (length) {
    case 25:
      return 50;
    case 50:
      return 75;
    case 75:
      return 100;
    case 100:
      return 25;
  }
}
