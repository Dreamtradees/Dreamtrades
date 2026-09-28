declare module "localtunnel" {
  import type { EventEmitter } from "node:events";

  type Tunnel = EventEmitter & {
    url: string;
    close: () => void;
  };

  type Options = {
    port: number;
    subdomain?: string;
    host?: string;
    local_host?: string;
  };

  export default function localtunnel(port: number | Options): Promise<Tunnel>;
}
