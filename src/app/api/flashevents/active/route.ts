import { NextRequest, NextResponse } from "next/server";
import { getActiveFlashEvent } from "@/app/api/controllers/flashEventController";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameCodeId = searchParams.get("gameCodeId");

    if (!gameCodeId) {
      return NextResponse.json(
        { error: "Missing gameCodeId" },
        { status: 400 },
      );
    }

    const activeEvent = await getActiveFlashEvent(parseInt(gameCodeId));

    return NextResponse.json({ activeEvent });
  } catch (error) {
    console.error("Error getting active flash event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
