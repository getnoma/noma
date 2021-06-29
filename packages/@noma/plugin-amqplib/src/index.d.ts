import { Connection } from "amqplib";

export default interface IAmqplib {
  connection?: Connection;
  connections: {
    [key: string]: Connection;
  };
}
