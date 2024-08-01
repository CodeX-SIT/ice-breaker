import { faker } from "@faker-js/faker";
import { Hobby } from "@/database"; // Adjust the path as necessary
import { User } from "@/database"; // Adjust the path as necessary
import { InferCreationAttributes, UUIDV4 } from "sequelize";
import { randomUUID } from "crypto";

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

const movieList = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Historical",
  "Horror",
  "Mystery",
  "Sci-Fi",
];

const songList = [
  "Pop",
  "Rock",
  "Rap",
  "Country",
  "Jazz",
  "Classical",
  "Blues",
  "Reggae",
  "Electronic",
  "Folk",
];

async function generateSampleHobbies(numberOfHobbies = 10) {
  const users = await User.findAll();

  if (users.length === 0) {
    console.log("No users found. Please create users first.");
    return;
  }

  const hobbies: InferCreationAttributes<Hobby>[] = [];

  for (let i = 0; i < numberOfHobbies; i++) {
    const id = randomUUID();
    const user = faker.helpers.arrayElement(users);
    const hobby = faker.helpers.arrayElement(hobbyList);
    const movie = faker.helpers.arrayElement(movieList);
    const song = faker.helpers.arrayElement(songList);

    hobbies.push({
      id,
      userId: user.id,
      hobbies: hobby,
      guiltyPleasures: hobby,
      favoriteMovies: movie,
      favoriteSongs: song,
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
