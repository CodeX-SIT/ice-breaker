import { Sequelize } from "sequelize";
import "server-only";

// Environment variables with fallbacks for development
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT || "5432");
const dbName = process.env.DB_NAME || "ice-breaker";
const dbUser = process.env.DB_USER || "postgres";
const dbPassword = process.env.DB_PASSWORD || "";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: dbHost,
  port: dbPort,
  database: dbName,
  username: dbUser,
  password: dbPassword,
  define: {
    defaultScope: {
      attributes: {
        // exclude these attributes by default from all queries
        exclude: ["createdAt", "updatedAt"],
      },
    },
    // timestamps: false,
  },
  logging: (message, timing) => {
    console.log(message, timing)
  },
  sync: {
    // force: true,
  },
});
