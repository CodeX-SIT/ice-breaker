import { faker } from "@faker-js/faker";
import { Hobby } from "@/database"; // Adjust the path as necessary
import { User } from "@/database"; // Adjust the path as necessary

const hobbyList = [
  "Reading",
  "Cooking",
  "Traveling",
  "Gardening",
  "Fishing",
  "Hiking",
  "Dancing",
  "Photography",
  "Drawing",
  "Writing",
];

async function generateSampleHobbies(numberOfHobbies = 10) {
  const users = await User.findAll();

  if (users.length === 0) {
    console.log("No users found. Please create users first.");
    return;
  }

  const hobbies = [];

  for (let i = 0; i < numberOfHobbies; i++) {
    const user = faker.helpers.arrayElement(users);
    const hobby = faker.helpers.arrayElement(hobbyList); // Random hobby from list

    hobbies.push({
      userId: user.id,
      hobby,
    });
  }

  try {
    await Hobby.bulkCreate(hobbies);
    console.log(`${numberOfHobbies} hobbies have been created.`);
  } catch (error) {
    console.error("Error creating sample hobbies:", error);
  }
}

export default generateSampleHobbies;
