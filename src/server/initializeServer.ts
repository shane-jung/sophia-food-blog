import * as dotenv from "dotenv";
dotenv.config();

import express, { Router } from "express";

const app = express();

import path from "path";
import { fileURLToPath } from "url";

import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function initializeServer(router: Router) {
  const isProduction = process.env.NODE_ENV === "production";
  const origin = { origin: isProduction ? false : "*" };

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.use(cookieParser());
  app.use("/api", router);
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../../index.html"));
  });

  return app;
}
