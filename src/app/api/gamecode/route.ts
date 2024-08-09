import { auth } from "@/auth";
import { ADMINS } from "@/constants";
import { User, UserGame } from "@/database";
import { GameCode } from "@/database/GameCode";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { redirect, RedirectType } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import latestValidGameCodeOfUser from "../controllers/latestValidGameOfUser";

// User posts to this route to join a game

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
    console.error(error);

    return NextResponse.json("Invalid body", { status: 400 });
  }

  const latestGame = await latestValidGameCodeOfUser(userId);

  if (latestGame) {
    return redirect(`/game/${latestGame.code}`, RedirectType.push);
    // return NextResponse.json("You are already in a game!", { status: 409 });
  }

  const dbGameCode = await GameCode.findOne({
    where: { code: gameCode.toLowerCase().trim() },
  });

  if (!dbGameCode) {
    return NextResponse.json("Invalid game code", { status: 404 });
  }

  const userGame = await UserGame.findOne({
    where: { userId: userId, gameCodeId: dbGameCode.id }
  })
  if (!userGame){
    await UserGame.create({
      userId,
      gameCodeId: dbGameCode.id,
    });
  }
  
  return redirect(`/game/${dbGameCode.code}`, RedirectType.push);
}
