import getStats from "@/app/api/controllers/getStats";
import {GameCode } from "@/database";
import { NextRequest, NextResponse } from "next/server";
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
