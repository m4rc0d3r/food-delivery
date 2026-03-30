import type { Repository, RepositoryIos } from "../ports";

class Service {
  private readonly storeRepository: Repository;

  constructor(storeRepository: Repository) {
    this.storeRepository = storeRepository;
  }

  create(params: RepositoryIos.Create.In) {
    return this.storeRepository.create(params);
  }

  list(params: RepositoryIos.List.In) {
    return this.storeRepository.list(params);
  }
}

export { Service };
