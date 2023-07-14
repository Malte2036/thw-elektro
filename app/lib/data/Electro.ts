import { Position } from "../Position";

export type ElektroType = "Consumer" | "Distributor" | "Producer";

export abstract class ElectroInterface {
  public readonly id: string;
  public readonly name: string | undefined;
  public position: Position;
  public readonly type: ElektroType;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    type: ElektroType
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.type = type;
  }
}

export function translateElectroType(type: ElektroType) {
  switch (type) {
    case "Consumer":
      return "Verbraucher";
    case "Distributor":
      return "Verteiler";
    case "Producer":
      return "Erzeuger";
  }
}
