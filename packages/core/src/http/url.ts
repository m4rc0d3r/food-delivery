import { COLON, EMPTY, SLASH } from "../str";

type Params = {
  protocol: string;
  address: string;
  port?: number | undefined;
  baseUrl?: string | undefined;
};

function createUrl({ protocol, address, port, baseUrl }: Params) {
  return [
    `${protocol}://${address}`,
    typeof port === "number" ? [COLON, port].join(EMPTY) : EMPTY,
    baseUrl ? [SLASH, baseUrl].join(EMPTY) : EMPTY,
  ].join(EMPTY);
}

export { createUrl };
