import getStats from "@/app/api/controllers/getStats";
import {
  ASSIGNMENT_MAX_SCORE_TIME_MS,
  BASE_SCORE,
  MAX_ASSIGNMENT_SCORE,
} from "@/constants";
import { Assigned, GameCode, User, UserGame } from "@/database";
import { reverse } from "dns";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
interface PageParams {
  code: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: PageParams },
) {
  const code = params.code;
  const gameCode = await GameCode.findOne({
    where: {
      code: code.toLowerCase().trim(),
    },
  });
  if (!gameCode) {
    return NextResponse.json("Game code not found", { status: 404 });
  }
  const stats = await getStats(gameCode);
  return NextResponse.json(stats);
}
