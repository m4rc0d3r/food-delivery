import * as z from "zod";

const zServerConfig = z
  .object({
    SERVER_PROTOCOL: z.string().nonempty(),
    SERVER_ADDRESS: z.string().nonempty(),
    SERVER_PORT: z.coerce.number().positive(),
  })
  .transform(({ SERVER_PROTOCOL, SERVER_ADDRESS, SERVER_PORT }) => ({
    protocol: SERVER_PROTOCOL,
    address: SERVER_ADDRESS,
    port: SERVER_PORT,
  }));
type ServerConfig = z.infer<typeof zServerConfig>;

export { zServerConfig };
export type { ServerConfig };
