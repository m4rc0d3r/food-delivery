import type { GenerateUid } from "../ports";

class Service {
  private readonly generateUid_: GenerateUid;

  constructor(generateUid_: GenerateUid) {
    this.generateUid_ = generateUid_;
  }

  generateUid(lengthInBytes: number) {
    return this.generateUid_(lengthInBytes);
  }
}

export { Service };
