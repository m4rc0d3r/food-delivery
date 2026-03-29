import type { Provider } from "./ports";

class Service {
  private readonly provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  list() {
    return this.provider.list();
  }
}

export { Service };
