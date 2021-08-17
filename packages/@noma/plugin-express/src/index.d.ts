import { Express } from "express";

export default interface ExpressNomaPluginResult {
  app: Express;
  apps: Record<string, Express>;
}
