import express, { Application, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import routes from "./routes";
dotenvFlow.config();
// Create Express application
const app: Application = express();

app.use("/api", routes);

export function startServer() {
  const PORT: number = Number(process.env.PORT) || 42069;
  app.listen(PORT, function () {
    console.log("Server is running on port:" + PORT);
  });
}
