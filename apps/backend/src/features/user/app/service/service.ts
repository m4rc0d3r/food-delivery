import { apply, either, function as function_, taskEither } from "fp-ts";

import type { Repository, RepositoryIos } from "../ports";

import type { Create, GetByCredentials } from "./ios";

import { NotFoundError } from "@/app";
import type { HashingService } from "@/features/hashing";

class Service {
  private readonly userRepository: Repository;
  private readonly passwordHashingService: HashingService;

  constructor(userRepository: Repository, passwordHashingService: HashingService) {
    this.userRepository = userRepository;
    this.passwordHashingService = passwordHashingService;
    this.userRepository = userRepository;
  }

  create({ password, ...rest }: Create.In) {
    return function_.pipe(
      apply.sequenceS(taskEither.ApplyPar)({
        passwordHash: this.passwordHashingService.hash(password),
      }),
      taskEither.flatMap(({ passwordHash }) =>
        function_.pipe(
          this.userRepository.create({
            passwordHash,
            ...rest,
          }),
        ),
      ),
    );
  }

  getByCredentials({ password, ...params }: GetByCredentials.In) {
    return function_.pipe(
      this.userRepository.getByContactDetails(params),
      taskEither.flatMap((user) =>
        function_.pipe(
          user,
          ({ passwordHash }) => this.passwordHashingService.compare(password, passwordHash),
          taskEither.flatMap((arePasswordsEqual) =>
            function_.pipe(
              arePasswordsEqual,
              either.fromPredicate(
                () => arePasswordsEqual,
                () => new NotFoundError(),
              ),
              either.map(() => user),
              taskEither.fromEither,
            ),
          ),
        ),
      ),
    );
  }

  getById(params: RepositoryIos.GetById.In) {
    return this.userRepository.getById(params);
  }
}

export { Service };
