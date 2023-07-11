export class Producer {
  public readonly id: string;
  public readonly name: string | undefined;

  constructor(id: string, name: string | undefined) {
    this.id = id;
    this.name = name;
  }
}
