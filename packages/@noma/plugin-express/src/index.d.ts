import { Express } from "express";

export interface ExpressNomaPluginResult {
  app: Express;
  apps: Record<string, Express>;
}
