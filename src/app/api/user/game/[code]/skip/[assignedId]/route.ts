import { Assigned, GameCode } from "@/database";
import { NextRequest, NextResponse } from "next/server";

interface PageParams {
  code: string;
  assignedId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: PageParams },
) {
  const { code, assignedId } = params;
  const gameCode = GameCode.findOne({
    where: {
      code: code.toLowerCase().trim(),
    },
  });

  const assigned = await Assigned.findByPk(Number(assignedId));

  if (!assigned)
    return NextResponse.json("Invalid assignedId", { status: 400 });

  if (assigned.completedAt) return NextResponse.json(null, { status: 200 });

  await assigned.update({
    isSkipped: true,
    completedAt: new Date(),
  });

  return NextResponse.json(null, { status: 200 });
}
