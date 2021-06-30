import { Connection } from "amqplib";

export default interface AmqplibNomaPluginResult {
  connection?: Connection;
  connections: {
    [key: string]: Connection;
  };
}
