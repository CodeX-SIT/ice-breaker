import generateSampleAssignments from "./assigned";
import generateSampleUsers from "./users";
import generateSampleHobbies from "./hobbies";
import { sequelize } from "../sequelize";

export default async function generateSampleData({ force } = { force: false }) {
  await sequelize.sync({ force });
  await generateSampleUsers();
  await generateSampleHobbies();
  await generateSampleAssignments();
}
