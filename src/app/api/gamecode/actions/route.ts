import { ADMINS } from "@/constants";
import { Assigned, GameCode, UserGame } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  action: z.enum(["start", "end"]),
  gameCode: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await checkAuthAndRedirect();
  if (!ADMINS.includes(session.user?.email ?? "")) {
    return NextResponse.json("Forbidden", { status: 403 });
  }

  let requestBody = null;
  try {
    let _requestBody = await request.json();
    requestBody = schema.parse(_requestBody);
  } catch (error) {
    return NextResponse.json("Invalid body", { status: 400 });
  }

  const action: "start" | "end" = requestBody.action;

  if (action === "start") {
    const gameCode = await GameCode.findOne({
      where: { code: requestBody.gameCode.toLowerCase().trim() },
    });

    if (!gameCode) {
      return NextResponse.json("Game code not found", { status: 404 });
    }

    if (gameCode.startedAt) {
      return NextResponse.json("Game already started", { status: 409 });
    }

    gameCode.startedAt = new Date();
    await gameCode.save();

    await createAllAssignments(gameCode);

    return NextResponse.json(gameCode);
  } else {
    const gameCode = await GameCode.findOne({
      where: { code: requestBody.gameCode.trim().toLowerCase() },
    });

    if (!gameCode) {
      return NextResponse.json("Game code not found", { status: 404 });
    }

    if (!gameCode.startedAt) {
      return NextResponse.json("Game not started", { status: 409 });
    }

    if (gameCode.endedAt) {
      return NextResponse.json("Game already ended", { status: 409 });
    }

    gameCode.endedAt = new Date();
    await gameCode.save();

    return NextResponse.json(gameCode);
  }
}

async function createAllAssignments(gameCode: GameCode) {
  const users = await UserGame.findAll({
    where: { gameCodeId: gameCode.id },
  });

  for (const user of users) {
    const filteredUsers = users.filter((user) => user.userId !== user.userId);
    if (filteredUsers.length === 0) {
      return;
    }
    // pick a random user from users who is not user
    let assignedUserId = user.userId;
    while (assignedUserId === user.userId) {
      assignedUserId = users[Math.floor(Math.random() * users.length)].userId;
    }

    await Assigned.create({
      userId: user.userId,
      assignedUserId,
      gameCodeId: gameCode.id,
      assignedAt: new Date(),
      isSkipped: false,
    });
  }
}
