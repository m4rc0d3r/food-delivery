import type { Provider } from "./ports";

class Service {
  private readonly provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  getMe() {
    return this.provider.getMe();
  }
}

export { Service };
