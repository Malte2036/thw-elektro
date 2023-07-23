import { Position } from "../Position";

export type ElectroType = "Consumer" | "Distributor" | "Producer";

export abstract class ElectroInterface {
  public readonly id: string;
  public readonly name: string | undefined;
  public position: Position;
  public readonly type: ElectroType;
  public readonly templateId: string | undefined;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    type: ElectroType,
    templateId: string | undefined
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.type = type;
    this.templateId = templateId;
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
