import { GameCode } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextRequest, NextResponse } from "next/server";

interface GameRouteParams {
  code: string;
}

export async function GET(
  request: NextRequest, // needs request function argument due to format of the GET function
  { params }: { params: GameRouteParams },
) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  const code = params.code;

  const gameCode = await GameCode.findOne({
    where: {
      code: code.toLowerCase().trim(),
    },
    include: [{ association: "users", include: ["aboutUser"] }],
  });

  if (!gameCode) {
    return NextResponse.json("Game code not found", { status: 404 });
  }

  const users = gameCode.users;
  return NextResponse.json({ users });
}
