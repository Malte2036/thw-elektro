export type CableLength = 25 | 50 | 75 | 100;
export type Voltage = 230 | 400; // Voltage (U): Volts (V)
export type Current = 16 | 32 | 63; // Current (I): Amperes (A)

export class Cable {
  public readonly id: string;
  public length: CableLength;
  public readonly voltage: Voltage;
  public readonly current: Current;

  constructor(
    id: string,
    length: CableLength,
    voltage: Voltage,
    current: Current
  ) {
    this.id = id;
    this.length = length;
    this.voltage = voltage;
    this.current = current;
  }

  getDiameter(): number {
    switch (this.current) {
      case 16:
        return 2.5;
      case 32:
        return 6.0;
      case 63:
        return 16.0;
      default:
        throw new Error(
          "Invalid current. Only 16A, 32A and 63A are supported."
        );
    }
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
