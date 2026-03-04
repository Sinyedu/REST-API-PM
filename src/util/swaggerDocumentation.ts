import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

export function setupDocumentation(app: Application) {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "City & Restaurant API",
      version: "1.0.0",
      description: "API documentation for managing cities and restaurants",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "JohnDoe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "mypassword123" },
          },
        },
        UserLogin: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "JohnDoe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "mypassword123" },
          },
        },
        City: {
          type: "object",
          required: ["name", "country"],
          properties: {
            id: { type: "string", example: "634f6f1234" },
            name: { type: "string", example: "Copenhagen" },
            country: { type: "string", example: "Denmark" },
            population: { type: "integer", example: 1200000 },
          },
        },
        Restaurant: {
          type: "object",
          required: ["name", "city"],
          properties: {
            id: { type: "string", example: "634f6f5678" },
            name: { type: "string", example: "La Trattoria" },
            city: { $ref: "#/components/schemas/City" },
            cuisine: { type: "string", example: "Italian" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  const options = {
    swaggerDefinition,
    apis: ["./src/routes.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:4000/api-docs");
}
