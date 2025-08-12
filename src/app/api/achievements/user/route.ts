import { NextRequest, NextResponse } from "next/server";
import { UserAchievement, Achievement } from "@/database";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameCodeId = searchParams.get("gameCodeId");

    const whereClause: any = {
      userId: session.user.id,
    };

    if (gameCodeId) {
      whereClause.gameCodeId = parseInt(gameCodeId);
    }

    const userAchievements = await UserAchievement.findAll({
      where: whereClause,
      include: [
        {
          model: Achievement,
          as: "achievement",
        },
      ],
      order: [["awardedAt", "DESC"]],
    });

    return NextResponse.json({ achievements: userAchievements });
  } catch (error) {
    console.error("Error getting user achievements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
