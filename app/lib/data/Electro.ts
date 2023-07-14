import { Position } from "../Position";

export type ElectroType = "Consumer" | "Distributor" | "Producer";

export abstract class ElectroInterface {
  public readonly id: string;
  public readonly name: string | undefined;
  public position: Position;
  public readonly type: ElectroType;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    type: ElectroType
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.type = type;
  }
}

export function translateElectroType(type: ElectroType) {
  switch (type) {
    case "Consumer":
      return "Verbraucher";
    case "Distributor":
      return "Verteiler";
    case "Producer":
      return "Erzeuger";
  }
}
