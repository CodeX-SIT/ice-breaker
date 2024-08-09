import {
  ASSIGNMENT_MAX_SCORE_TIME_MS,
  MAX_ASSIGNMENT_SCORE,
  BASE_SCORE,
} from "@/constants";
import { GameCode, UserGame, User } from "@/database";
import { Op } from "sequelize";

export default async function getStats(gameCode: GameCode, userId?: string) {
  let userGames: UserGame[];
  let inGameUserIds: string[] = [];
  if (!userId) {
    userGames = await UserGame.findAll({
      where: {
        gameCodeId: gameCode.id,
      },
    });

    inGameUserIds = userGames.map((userGame) => userGame.userId);
  }
  const users = await User.findAll({
    where: {
      id: userId || inGameUserIds, // If userId is provided, only get stats for that user
    },
    include: [
      {
        association: "assignedUsers",
        where: {
          completedAt: {
            [Op.ne]: null,
          },
          isSkipped: false,
          gameCodeId: gameCode.id,
        },
        required: false,
      },
      "aboutUser",
    ],
  });

  const result = users.map((user) => {
    let score = 0; // base score for finding each user
    for (const assigned of user.assignedUsers) {
      const assignedAt = assigned.assignedAt;
      const completedAt = assigned.completedAt;
      const timeTaken = completedAt!.getTime() - assignedAt.getTime();
      let ratio =
        (ASSIGNMENT_MAX_SCORE_TIME_MS - timeTaken) /
        ASSIGNMENT_MAX_SCORE_TIME_MS;

      if (ratio < 0) ratio = 0;
      const scoreForTime = ratio * MAX_ASSIGNMENT_SCORE;
      score += scoreForTime + BASE_SCORE;
    }
    return {
      userId: user.id,
      completedAssignments: Math.round(score),
      name: user.aboutUser?.name,
    };
  });

  result.sort((a, b) => b.completedAssignments - a.completedAssignments);

  return result;
}

export async function getStatsForUser(gameCode: GameCode, userId: string) {
  let result = await getStats(gameCode, userId);
  if (result.length === 0) {
    return;
  }
  return result[0];
}
