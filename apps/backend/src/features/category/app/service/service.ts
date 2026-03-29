import type { Repository } from "../ports";

class Service {
  private readonly storeRepository: Repository;

  constructor(storeRepository: Repository) {
    this.storeRepository = storeRepository;
  }

  list() {
    return this.storeRepository.list();
  }
}

export { Service };
