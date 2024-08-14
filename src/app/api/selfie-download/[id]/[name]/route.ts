import { Selfie } from "@/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; name: string } },
) {
  const selfieId = params.id;
  const selfieName = params.name;
  const selfie = await Selfie.findByPk(selfieId);
  if (!selfie) {
    return NextResponse.json("Selfie not found", { status: 404 });
  }
  const selfieFile = selfie.data;
  return new NextResponse(selfieFile, {
    headers: {
      "Content-Disposition": `attachment; filename=${selfieName}`,
      "Content-Type": selfie.mimeType,
    },
  });
}
