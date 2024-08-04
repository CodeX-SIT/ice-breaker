import { Assigned, GameCode, UserGame } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextRequest, NextResponse } from "next/server";

type AssignedRouteParams = {
  params: {
    userId: string;
  };
};

/**
 * This will return the latest assigned user for the given user and their avatar and their hobby.
 */
export async function GET(
  request: NextRequest, // needs request function argument due to format of the GET function
) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id;

  const userGame = await UserGame.findOne({
    where: { userId: userId },
    order: [["createdAt", "DESC"]],
  });
  if (!userGame) {
    return new NextResponse("User not found", { status: 404 });
  }

  const gameCode = await GameCode.findOne({
    where: { id: userGame.gameCodeId },
  });
  if (!gameCode) {
    return new NextResponse("Game code not found", { status: 404 });
  }

  const result = await Assigned.findAll({
    where: {
      userId: userId,
      isCompleted: false,
      gameCodeId: gameCode.id,
    },
    include: [
      {
        as: "assignedUser",
        include: ["avatar", "hobby"],
      },
    ],
    limit: 1,
    order: [["assignedAt", "DESC"]],
  });
  return new NextResponse(JSON.stringify(result, null, 2));
}
