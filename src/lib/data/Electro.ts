import { Position } from "../Position";
import { Plug } from "./Plug";

export const COS_PHY = 0.8;

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

export abstract class ElectroInterfaceWithInputPlug extends ElectroInterface {
  public inputPlug: Plug;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    type: ElectroType,
    templateId: string | undefined,
    inputPlug: Plug | undefined
  ) {
    super(id, name, position, type, templateId);

    this.inputPlug = inputPlug ?? { current: 16, voltage: 230 };
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

export function getTitleForElectro(electro: ElectroInterface) {
  const translatedType = translateElectroType(electro.type);
  const name = electro.name;
  return `${translatedType}${name != undefined ? ` (${name})` : ""}:`;
}
