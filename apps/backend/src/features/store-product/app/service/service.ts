import type { Repository, RepositoryIos } from "../ports";

class Service {
  private readonly storeRepository: Repository;

  constructor(storeRepository: Repository) {
    this.storeRepository = storeRepository;
  }

  list(params: RepositoryIos.List.In) {
    return this.storeRepository.list(params);
  }
}

export { Service };
