import { faker } from "@faker-js/faker";
import { AboutUser } from "@/database"; // Adjust the path as necessary
import { User } from "@/database"; // Adjust the path as necessary
import { InferCreationAttributes } from "sequelize";

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

  const hobbies: InferCreationAttributes<AboutUser>[] = [];

  for (let i = 0; i < numberOfHobbies; i++) {
    const id = faker.number.int();
    const user = faker.helpers.arrayElement(users);
    const AboutUser = faker.helpers.arrayElement(hobbyList);
    const movie = faker.helpers.arrayElement(movieList);
    const song = faker.helpers.arrayElement(songList);

    hobbies.push({
      id,
      name: faker.person.fullName(),
      dateOfBirth: faker.date.past(),
      userId: user.id,
      hobbies: AboutUser,
      guiltyPleasures: AboutUser,
      favoriteMovies: movie,
      favoriteSongs: song,
    });
  }

  try {
    await AboutUser.bulkCreate(hobbies);
    console.log(`${numberOfHobbies} hobbies have been created.`);
  } catch (error) {
    console.error("Error creating sample hobbies:", error);
  }
}

export default generateSampleHobbies;
