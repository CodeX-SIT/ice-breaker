import { Sequelize } from "sequelize";
import "server-only";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  define: {
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
    // timestamps: false,
  },
});
