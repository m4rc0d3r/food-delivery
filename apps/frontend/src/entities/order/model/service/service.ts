import type { Provider, ProviderIos } from "./ports";

class Service {
  private readonly provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  createByAuth(params: ProviderIos.CreateByAuth.In) {
    return this.provider.createByAuth(params);
  }

  createByUnauth(params: ProviderIos.CreateByUnauth.In) {
    return this.provider.createByUnauth(params);
  }

  list(params: ProviderIos.List.In) {
    return this.provider.list(params);
  }
}

export { Service };
