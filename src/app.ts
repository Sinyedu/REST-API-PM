import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import routes from "./routes";
import { testConnection } from "./repository/database";
import cors from "cors";
import { setupDocumentation } from "./util/swaggerDocumentation";

dotenvFlow.config();

const app: Application = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: [
      "auth-token",
      "Origin",
      "X-Requested-Width",
      "Content-Type",
      "Accept",
    ],
    credentials: true,
  }),
);

app.use("/api", routes);

setupDocumentation(app);

export function startServer() {
  testConnection();
  const PORT: number = Number(process.env.PORT) || 42069;
  app.listen(PORT, function() {
    console.log("Server is running on port:" + PORT);
  });
}
