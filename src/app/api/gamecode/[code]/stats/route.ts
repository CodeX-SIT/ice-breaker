import {
  ASSIGNMENT_MAX_SCORE_TIME_MS,
  BASE_SCORE,
  MAX_ASSIGNMENT_SCORE,
} from "@/constants";
import { Assigned, GameCode, User, UserGame } from "@/database";
import { reverse } from "dns";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
interface PageParams {
  code: string;
}

async function getStats(gameCode: GameCode) {
  const userGames = await UserGame.findAll({
    where: {
      gameCodeId: gameCode.id,
    },
  });

  const inGameUserIds = userGames.map((userGame) => userGame.userId);

  const users = await User.findAll({
    where: {
      id: inGameUserIds,
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

export async function GET(
  request: NextRequest,
  { params }: { params: PageParams },
) {
  const code = params.code;
  const gameCode = await GameCode.findOne({
    where: {
      code: code.toLowerCase().trim(),
    },
  });
  if (!gameCode) {
    return NextResponse.json("Game code not found", { status: 404 });
  }
  const stats = await getStats(gameCode);
  return NextResponse.json(stats);
}
