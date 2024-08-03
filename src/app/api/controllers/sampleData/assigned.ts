import { faker } from "@faker-js/faker";
import { Assigned } from "@/database"; // Adjust the path as necessary
import { User } from "@/database"; // Adjust the path as necessary

async function generateSampleAssignments(numberOfAssignments = 10) {
  const users = await User.findAll();

  if (users.length < 2) {
    console.log(
      "Not enough users to create assignments. Please create more users first.",
    );
    return;
  }

  const assignments = [];

  for (let i = 0; i < numberOfAssignments; i++) {
    const user = faker.helpers.arrayElement(users);
    let assignedUser;

    // Ensure assignedUser is different from user
    do {
      assignedUser = faker.helpers.arrayElement(users);
    } while (assignedUser.id === user.id);

    const assignedAt = faker.date.recent({ days: 30 }); // Date within the last 30 days
    const isCompleted = faker.helpers.arrayElement([true, false]);
    const completedAt = isCompleted
      ? faker.date.between({from: assignedAt, to: new Date()})
      : null;

    assignments.push({
      userId: user.id,
      assignedUserId: assignedUser.id,
      assignedAt,
      completedAt,
      isCompleted,
    });
  }

  try {
    await Assigned.bulkCreate(assignments);
    console.log(`${numberOfAssignments} assignments have been created.`);
  } catch (error) {
    console.error("Error creating sample assignments:", error);
  }
}

export default generateSampleAssignments;
