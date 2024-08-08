import { Sequelize } from "sequelize";
import "server-only";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  define: {
    defaultScope: {
      attributes: {
        // exclude these attributes by default from all queries
        exclude: ["createdAt", "updatedAt"],
      },
    },
    // timestamps: false,
  },
  logging: false,
});
