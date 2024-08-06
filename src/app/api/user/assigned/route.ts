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
  const userId = session.user?.id!;

  // get the latest game that the user is a part of
  const gameCode = await GameCode.findOne({
    where: {
      endedAt: { $ne: null },
    },
    include: [
      {
        association: "users",
        where: { id: userId },
        required: true,
      },
    ],
  });

  if (!gameCode) {
    return NextResponse.json("User is not in game", { status: 404 });
  }

  if (!gameCode.startedAt) {
    // TODO: Redirect user to game waiting page
  }

  // get the latest assignment
  const result = await Assigned.findOne({
    where: {
      userId: userId,
      isCompleted: false,
      gameCodeId: gameCode.id,
    },
    include: [
      {
        association: "assignedUser",

        include: ["avatar", "aboutUser"],
      },
    ],
    order: [["assignedAt", "DESC"]],
  });

  return NextResponse.json(result);
}
