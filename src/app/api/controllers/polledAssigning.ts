import { ASSIGNMENT_AUTO_SKIP_MS } from "@/constants";
import { Assigned, GameCode, UserGame } from "@/database";

function timeDifference(assignedAt: Date) {
  return Date.now() - assignedAt.getTime();
}

export default async function polledAssigning(code: string) {
  const gameCode = await GameCode.findOne({
    where: {
      code,
    },
  });
  if (!gameCode || gameCode.endedAt) {
    return false;
  }

  if (!gameCode.startedAt) {
    // return has to be true to keep the interval running
    return true;
  }

  const allUsers = await UserGame.findAll({
    where: {
      gameCodeId: gameCode.id,
    },
  });
  const assigned = await Assigned.findAll({
    where: {
      gameCodeId: gameCode.id,
      completedAt: null,
    },
  });

  const previousAssignments = assigned.filter((assignment) => {
    return timeDifference(assignment.assignedAt) > ASSIGNMENT_AUTO_SKIP_MS;
  });

  //   const recentAssignments = assigned.filter((assignment) => {
  //     return timeDifference(assignment.assignedAt) <= ASSIGNMENT_AUTO_SKIP_MS;
  //   });

  const notAssignedUsers = allUsers.filter((user) => {
    const isAssigned = assigned.find(
      (assignment) => assignment.userId === user.userId,
    );
    const isNotAssigned = !isAssigned;
    return isNotAssigned;
  });

  const previousAssignmentIds = previousAssignments.map(
    (assignment) => assignment.id,
  );
  Assigned.update(
    {
      isSkipped: true,
      completedAt: new Date(),
    },
    {
      where: { id: previousAssignmentIds },
    },
  );

  // TODO: Call the new assignment function for previous assignments
  // TODO: Call the assignment function for notAssignedUsers users

  return true;
}

// Usage Example:
// const interval = setInterval(async () => {
//   const keepRunning = await polledAssigning("CODE");
//   if (!keepRunning) clearInterval(interval);
// }, 1000);
