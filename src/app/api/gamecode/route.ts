import { auth } from "@/auth";
import { ADMINS } from "@/constants";
import { User, UserGame } from "@/database";
import { GameCode } from "@/database/GameCode";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const session = await checkAuthAndRedirect();

  if (!ADMINS.includes(session.user?.email ?? "")) {
    return NextResponse.json("Forbidden", { status: 403 });
  }

  const gameCode = await GameCode.findOne({ order: [["createdAt", "DESC"]] });

  return NextResponse.json(gameCode, { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await checkAuthAndRedirect();

  const userId = session.user?.id;

  if (!userId) {
    return NextResponse.json("Forbidden", { status: 403 });
  }

  const unverifiedGameCode = await request.text();
  if (!unverifiedGameCode) {
    return NextResponse.json("Invalid body", { status: 400 });
  }

  let gameCode = null;
  try {
    gameCode = z.string().parse(unverifiedGameCode);
  } catch (error) {
    return NextResponse.json("Invalid body", { status: 400 });
  }

  const dbGameCode = await GameCode.findOne({
    where: { code: gameCode.toLowerCase() },
  });
  if (!dbGameCode) {
    return NextResponse.json("Invalid game code", { status: 404 });
  }

  const userGame = await UserGame.findOne({
    where: { userId, gameCodeId: dbGameCode.id },
  });

  if (userGame) {
    return NextResponse.json("You are already in a game!", { status: 409 });
  }

  await UserGame.create({
    userId,
    gameCodeId: dbGameCode.id,
  });

  return redirect("/game", RedirectType.replace);
}
