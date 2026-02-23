import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import routes from "./routes";
import { testConnection } from "./repository/database";
import cors from "cors";
dotenvFlow.config();
// Create Express application
const app: Application = express();
app.use(express.json());

app.use("/api", routes);



export function startServer() {

  app.use(cors({

    // Allow request from any origin
    origin: "*",

    // allow HTTP methods
    methods: ["GET", "PUT", "POST", "DELETE"],

    // allow headers
    allowedHeaders: ['auth-token', 'Origin', 'X-Requested-Width', 'Content-Type', 'Accept'],

    // allow credentials
    credentials: true
  }))

  testConnection();
  const PORT: number = Number(process.env.PORT) || 42069;
  app.listen(PORT, function() {
    console.log("Server is running on port:" + PORT);
  });
}
