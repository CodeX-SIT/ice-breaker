import { faker } from '@faker-js/faker';
import { User } from '@/database'; // Adjust the path as necessary

async function generateSampleUsers(numberOfUsers = 10) {
  const users = [];

  for (let i = 0; i < numberOfUsers; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({firstName, lastName});
    const password = 'password123'; // Use a default password for hashing

    users.push({
      email,
      lastName,
      firstName,
      password,
    });
  }

  try {
    await User.bulkCreate(users);
    console.log(`${numberOfUsers} users have been created.`);
  } catch (error) {
    console.error('Error creating sample users:', error);
  }
}

export default generateSampleUsers;
