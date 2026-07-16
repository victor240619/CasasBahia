import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createDefaultShopState } from "../src/store/defaultShopState.js";

const rootDir = path.resolve(import.meta.dirname, "..");
const distDir = path.join(rootDir, "dist");
const serverDir = path.join(distDir, "server");
const distOpenAiDir = path.join(distDir, ".openai");
const hostingSource = path.join(rootDir, ".openai", "hosting.json");
const hostingTarget = path.join(distOpenAiDir, "hosting.json");
const templatePath = path.join(rootDir, "server", "sites-worker.template.js");
const workerTarget = path.join(serverDir, "index.js");

mkdirSync(serverDir, { recursive: true });
mkdirSync(distOpenAiDir, { recursive: true });

copyFileSync(hostingSource, hostingTarget);

const defaultState = createDefaultShopState();
const workerSource = readFileSync(templatePath, "utf8").replace(
  "__DEFAULT_STATE_JSON__",
  JSON.stringify(defaultState)
);

writeFileSync(workerTarget, workerSource);
