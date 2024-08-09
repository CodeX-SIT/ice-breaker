import { ADMINS } from "@/constants";
import { GameCode } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { create } from "domain";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;

  if (!ADMINS.includes(session.user!.email!)) {
    return NextResponse.json("Forbidden", { status: 403 });
  }

  let requestBody = null;
  try {
    requestBody = await request.json();
  } catch (error) {
    requestBody = { createGameCode: false, force: false };
  }

  const _createGameCode = requestBody.createGameCode;
  const _force = requestBody.force;

  let createGameCode: boolean;
  let force: boolean;

  try {
    createGameCode = z.oboolean().parse(_createGameCode)!!;
    force = z.oboolean().parse(_force)!!;
  } catch (error) {
    return NextResponse.json("Invalid body", { status: 400 });
  }

  const gameCode = await GameCode.findOne({
    order: [["createdAt", "DESC"]],
    where: { userId },
  });

  if (!gameCode) {
    if (!createGameCode) {
      return NextResponse.json("No game code available", { status: 404 });
    }
    return NextResponse.json(await GameCode.create({ userId }));
  }

  if (gameCode.endedAt || force) {
    // Game has ended or forced, create a new game code
    return NextResponse.json(await GameCode.create({ userId }), {
      status: 201,
    });
  }

  return NextResponse.json(gameCode, {
    status: 409,
  });
}
