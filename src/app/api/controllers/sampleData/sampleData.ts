import generateSampleUsers from "./users";
import { sequelize } from "@/database/sequelize";

export default async function generateSampleData({ force } = { force: false }) {
  await sequelize.sync({ force });
  await generateSampleUsers();
}
