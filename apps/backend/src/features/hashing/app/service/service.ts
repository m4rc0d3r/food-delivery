import type { CompareDataHash, HashData } from "../ports";

class Service {
  private readonly hashData: HashData;
  private readonly compareHashWithData: CompareDataHash;

  constructor(hashData: HashData, compareHashWithData: CompareDataHash) {
    this.hashData = hashData;
    this.compareHashWithData = compareHashWithData;
  }

  hash(data: string) {
    return this.hashData(data);
  }

  compare(data: string, hash: string) {
    return this.compareHashWithData(data, hash);
  }
}

export { Service };
