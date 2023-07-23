import { Position } from "../Position";
import { ElectroInterface } from "./Electro";

export class Producer extends ElectroInterface {
  public energyFlow: number = 0;

  constructor(
    id: string,
    name: string | undefined,
    position: Position,
    templateId: string | undefined
  ) {
    super(id, name, position, "Producer", templateId);
  }
}
