import { NextRequest, NextResponse } from "next/server";
import { triggerFlashEvent } from "@/app/api/controllers/flashEventController";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameCodeId, eventId, adminId } = body;

    if (!gameCodeId || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const flashEvent = await triggerFlashEvent(
      gameCodeId,
      eventId,
      adminId || session.user.id,
    );

    return NextResponse.json({ flashEvent });
  } catch (error) {
    console.error("Error triggering flash event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
