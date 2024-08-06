import { GameCode } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const session = await checkAuthAndRedirect();

  if (
    ![
      "garret.fernandez.btech2022@sitpune.edu.in",
      "shraddha.bhaskar.btech2022@sitpune.edu.in",
      "pramit.sharma.btech2022@sitpune.edu.in",
      "bosco.chanam.btech2021@sitpune.edu.in",
      "sehaj.saluja.btech2021@sitpune.edu.in",
      "saksham.gupta.btech2021@sitpune.edu.in",
      "pranav.suri.btech2022@sitpune.edu.in",
    ].includes(session.user!.email!)
  ) {
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

  const gameCode = await GameCode.findOne({ order: [["createdAt", "DESC"]] });

  if (createGameCode) {
    if (!gameCode?.endedAt && force) {
      const newGameCode = await GameCode.create();
      return NextResponse.json(newGameCode, { status: 201 });
    } else if (!gameCode?.endedAt) {
      return NextResponse.json("Unused Game code already exists", {
        status: 409,
      });
    }
  } else {
    if (gameCode?.endedAt) {
      return NextResponse.json("No game code available", { status: 404 });
    }
    return NextResponse.json(gameCode);
  }
}
