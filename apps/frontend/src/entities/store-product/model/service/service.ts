import type { Provider, ProviderIos } from "./ports";

class Service {
  private readonly provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  list(params: ProviderIos.List.In) {
    return this.provider.list(params);
  }
}

export { Service };
