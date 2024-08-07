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
          gameCodeId: gameCode.id,
        },
        required: false,
      },
      "aboutUser",
    ],
  });

  const result = users.map((user) => {
    console.log(user);
    return {
      userId: user.id,
      completedAssignments: user.assignedUsers.length,
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
      code: code,
    },
  });
  if (!gameCode) {
    return NextResponse.json("Game code not found", { status: 404 });
  }
  const stats = await getStats(gameCode);
  return NextResponse.json(stats);
}
