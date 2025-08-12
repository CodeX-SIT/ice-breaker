import { NextRequest, NextResponse } from "next/server";
import { checkAndAwardAchievements } from "@/app/api/controllers/achievementController";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameCodeId, assignedId } = body;

    if (!gameCodeId) {
      return NextResponse.json(
        { error: "Missing gameCodeId" },
        { status: 400 },
      );
    }

    const newAchievements = await checkAndAwardAchievements({
      userId: session.user.id,
      gameCodeId,
      assignedId,
    });

    return NextResponse.json({ achievements: newAchievements });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
