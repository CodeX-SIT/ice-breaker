import { Assigned, GameCode, UserGame } from "@/database";

export async function createUserAssignment(gameCode: GameCode, userId: string) {
  const assignee = await UserGame.findAll({
    where: { gameCodeId: gameCode.id },
  });
  const previousAssignment = await Assigned.findAll({
    where: { gameCodeId: gameCode.id, userId },
  });

  const possibleAssignees = assignee.filter(
    (user) =>
      user.userId !== userId &&
      !previousAssignment.some(
        (assignment) => assignment.assignedUserId === user.userId,
      ),
  );

  if (possibleAssignees.length === 0) {
    return null;
  }

  const assignedUser =
    possibleAssignees[Math.floor(Math.random() * possibleAssignees.length)];

  const assignment = await Assigned.create({
    gameCodeId: gameCode.id,
    userId,
    assignedAt: new Date(),
    assignedUserId: assignedUser.userId,
    isSkipped: false,
  });
  return assignment;
}
