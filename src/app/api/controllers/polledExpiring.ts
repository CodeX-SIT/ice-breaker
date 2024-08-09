import { ASSIGNMENT_AUTO_SKIP_MS } from "@/constants";
import { Assigned, GameCode, UserGame } from "@/database";

function timeDifference(assignedAt: Date) {
  return Date.now() - assignedAt.getTime();
}
/**
 * @description This function is used to expire the assignments of users whose time has expired
 */
export default async function polledExpiring(code: string) {
  const gameCode = await GameCode.findOne({
    where: {
      code: code.toLowerCase().trim(),
    },
  });
  if (!gameCode || gameCode.endedAt) {
    return false;
  }

  if (!gameCode.startedAt) {
    // return has to be true to keep the interval running
    // below logic is not needed as the game has not started yet
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
    const isAssigned = assigned.some(
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

  return true;
}

// Usage Example:
// const interval = setInterval(async () => {
//   const keepRunning = await polledAssigning("CODE");
//   if (!keepRunning) clearInterval(interval);
// }, 1000);
