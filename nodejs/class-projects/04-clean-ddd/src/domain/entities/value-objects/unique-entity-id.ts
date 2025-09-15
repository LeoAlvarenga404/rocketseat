import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private value: string;

  toSTring() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }
}
