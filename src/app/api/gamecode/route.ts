import { auth } from "@/auth";
import { User } from "@/database";
import { GameCode } from "@/database/GameCode";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const gameCodes = await GameCode.findAll();
  const response = new NextResponse(JSON.stringify(gameCodes), { status: 200 });
  return response;
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 483 });
  }

  const userId = session.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 484 });
  }

  const jsonBody = JSON.parse(
    String((await request.body?.getReader().read()) ?? ""),
  );
  if (!jsonBody.gameCode) {
    return new NextResponse("Invalid body", { status: 400 });
  }

  const gameCode = jsonBody.gameCode;

  const valid = GameCode.validateGameCode(gameCode);
  if (!valid) {
    return new NextResponse("Invalid game code", { status: 404 });
  }

  const dbUser = await User.findByPk(userId);
  if (!dbUser) return new NextResponse("User not found", { status: 500 });
  await dbUser.setGameCode(gameCode);

  return redirect("/", RedirectType.replace);
}
