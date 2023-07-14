import next from "next/types";
import { toTargetSourceString } from "../utils";

export type CableLength = 25 | 50 | 75 | 100;
export type Voltage = 230 | 400; // Voltage (U): Volts (V)
export type Current = 16 | 32 | 63; // Current (I): Amperes (A)

export class Cable {
  public readonly id: string;
  public length: CableLength;
  public voltage: Voltage;
  public current: Current;

  public readonly source: string;
  public readonly target: string;

  public voltageDrop: number;

  constructor(
    id: string,
    length: CableLength,
    voltage: Voltage,
    current: Current,
    source: string,
    target: string,
    voltageDrop: number = 0
  ) {
    this.id = id;
    this.length = length;
    this.voltage = voltage;
    this.current = current;
    this.source = source;
    this.target = target;
    this.voltageDrop = voltageDrop;
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

  toTargetSourceString() {
    return toTargetSourceString(this.target, this.source);
  }

  equals(other: Cable): boolean {
    return (
      this.id === other.id &&
      this.length === other.length &&
      this.voltage === other.voltage &&
      this.current === other.current &&
      this.source === other.source &&
      this.target === other.target &&
      this.voltageDrop === other.voltageDrop
    );
  }

  nextLength(): void {
    this.length = getNextCableLength(this.length);
  }

  nextType(): void {
    const { voltage, current } = getNextCableType(this.voltage, this.current);
    this.voltage = voltage;
    this.current = current;
  }
}

function getNextCableLength(length: CableLength): CableLength {
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

function getNextCableType(
  voltage: Voltage,
  current: Current
): { voltage: Voltage; current: Current } {
  switch (current) {
    case 16:
      if (voltage === 230) return { voltage: 400, current: 16 };
      return { voltage: 400, current: 32 };
    case 32:
      return { voltage: 400, current: 63 };
    case 63:
      return { voltage: 230, current: 16 };
    default:
      throw new Error("Invalid current. Only 16A, 32A and 63A are supported.");
  }
}
