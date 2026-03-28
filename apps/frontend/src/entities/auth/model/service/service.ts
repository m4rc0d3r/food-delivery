import type { Provider, ProviderIos } from "./ports";

class Service {
  private readonly provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  register(params: ProviderIos.Register.In) {
    return this.provider.register(params);
  }

  login(params: ProviderIos.Login.In) {
    return this.provider.login(params);
  }

  logout() {
    return this.provider.logout();
  }
}

export { Service };
