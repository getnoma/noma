import { Express } from "express";

interface ExpressNomaPluginResult {
  app: Express;
  apps: Record<string, Express>;
}
