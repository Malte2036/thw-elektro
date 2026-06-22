import { toTargetSourceString } from "../utils";
import { Plug, getNextCablePlug } from "./Plug";

export type CableLength = 1 | 2 | 25 | 50 | 75 | 100;

export class Cable {
  public readonly id: string;
  public length: CableLength;
  public plug: Plug;

  public readonly source: string;
  public readonly target: string;

  public voltageDrop: number;
  public activePower: number;
  public apparentPower: number;

  constructor(
    id: string,
    length: CableLength,
    plug: Plug,
    source: string,
    target: string,
    voltageDrop: number = 0,
    activePower: number = 0,
    apparentPower: number = 0
  ) {
    this.id = id;
    this.length = length;
    this.plug = plug;
    this.source = source;
    this.target = target;
    this.voltageDrop = voltageDrop;
    this.activePower = activePower;
    this.apparentPower = apparentPower;
  }

  static fromJSON(json: {
    id: string;
    length: CableLength;
    plug: Plug;
    source: string;
    target: string;
    voltageDrop: number;
    activePower?: number;
    apparentPower?: number;
  }): Cable {
    return new Cable(
      json.id,
      json.length,
      json.plug,
      json.source,
      json.target,
      json.voltageDrop,
      json.activePower ?? 0,
      json.apparentPower ?? 0
    );
  }

  toTargetSourceString() {
    return toTargetSourceString(this.target, this.source);
  }

  equals(other: Cable): boolean {
    return (
      this.id === other.id &&
      this.length === other.length &&
      this.plug === other.plug &&
      this.source === other.source &&
      this.target === other.target &&
      this.voltageDrop === other.voltageDrop &&
      this.activePower === other.activePower &&
      this.apparentPower === other.apparentPower
    );
  }

  nextLength(): void {
    this.length = getNextCableLength(this.length);
  }

  nextPlug(): void {
    this.plug = getNextCablePlug(this.plug);
  }

  getCurrent(): number {
    if (this.apparentPower === 0) return 0;
    if (this.plug.voltage === 230) {
      return this.apparentPower / 230;
    }
    // For 400V 3-phase: I = S / (U * sqrt(3))
    return this.apparentPower / (400 * Math.sqrt(3));
  }
}

function getNextCableLength(length: CableLength): CableLength {
  switch (length) {
    case 1:
      return 2;
    case 2:
      return 25;
    case 25:
      return 50;
    case 50:
      return 75;
    case 75:
      return 100;
    case 100:
      return 1;
  }
}
