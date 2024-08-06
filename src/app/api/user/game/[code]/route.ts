import { Assigned, GameCode } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextRequest, NextResponse } from "next/server";

interface GameRouteParams {
  code: string;
}

function fetchLatestAssigned(gameCodeId: number, userId: string) {
  return Assigned.findOne({
    where: {
      userId: userId,
      isCompleted: false,
      gameCodeId: gameCodeId,
    },
    include: [
      {
        association: "assignedUser",
        include: ["avatar", "aboutUser"],
      },
    ],
    order: [["assignedAt", "DESC"]],
  });
}

export async function GET(
  request: NextRequest, // needs request function argument due to format of the GET function
  { params }: { params: GameRouteParams },
) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  const code = params.code;

  const gameCode = await GameCode.findOne({
    where: {
      code: code,
    },
    include: ["users"],
  });

  if (!gameCode) {
    return NextResponse.json("Game code not found", { status: 404 });
  }

  const userInGame = gameCode.users.find((user) => user.id === userId);
  let gameState: "waiting" | "started" | "ended" | "notInGame";

  if (!userInGame) {
    gameState = "notInGame";
    return NextResponse.json({ gameState });
  }

  if (gameCode.endedAt) {
    gameState = "ended";
    // TODO: Send game stats
    return NextResponse.json({ gameState });
  } else if (gameCode.startedAt) {
    gameState = "started";
    const assigned = await fetchLatestAssigned(gameCode.id, userId);
    return NextResponse.json({ gameState, assigned });
  } else {
    gameState = "waiting";
    return NextResponse.json({ gameState });
  }
}

export async function POST(request: NextRequest) {
    
}