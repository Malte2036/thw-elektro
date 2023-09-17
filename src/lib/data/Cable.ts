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

  constructor(
    id: string,
    length: CableLength,
    plug: Plug,
    source: string,
    target: string,
    voltageDrop: number = 0
  ) {
    this.id = id;
    this.length = length;
    this.plug = plug;
    this.source = source;
    this.target = target;
    this.voltageDrop = voltageDrop;
  }

  static fromJSON(json: any): Cable {
    return new Cable(
      json.id,
      json.length,
      json.plug,
      json.source,
      json.target,
      json.voltageDrop
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
      this.voltageDrop === other.voltageDrop
    );
  }

  nextLength(): void {
    this.length = getNextCableLength(this.length);
  }

  nextPlug(): void {
    this.plug = getNextCablePlug(this.plug);
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
