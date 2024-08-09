import { AboutUser } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  const aboutUser = await AboutUser.findOne({
    where: { userId },
  });
  return NextResponse.json(aboutUser);
}
