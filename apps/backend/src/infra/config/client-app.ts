import * as z from "zod";

const zClientAppConfig = z
  .object({
    CLIENT_APP_PROTOCOL: z.string().nonempty(),
    CLIENT_APP_ADDRESS: z.string().nonempty(),
    CLIENT_APP_PORT: z.coerce.number().positive(),
  })
  .transform(({ CLIENT_APP_PROTOCOL, CLIENT_APP_ADDRESS, CLIENT_APP_PORT }) => ({
    protocol: CLIENT_APP_PROTOCOL,
    address: CLIENT_APP_ADDRESS,
    port: CLIENT_APP_PORT,
  }));
type ClientAppConfig = z.infer<typeof zClientAppConfig>;

export { zClientAppConfig };
export type { ClientAppConfig };
