import { Avatar } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { AvatarProps } from "@/components/AvatarPreview";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

type AvatarRouterParams = {
  params: {
    userId: string;
  };
};

export async function GET() {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  const result = await Avatar.findOne({ where: { userId } });
  return NextResponse.json(JSON.stringify(result, null, 2));
}

export async function POST(request: NextRequest) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  const body: AvatarProps | null = await request.json();
  if (!body) {
    return NextResponse.json(null, { status: 400 });
  }

  //TODO: implement zod parsing for body, and validate user id
  const avatar = await Avatar.findOne({ where: { userId } });
  let newAvatar: Avatar;
  if (avatar) {
    newAvatar = await avatar.update({ ...body });
  } else {
    newAvatar = await Avatar.create({ ...body, userId });
  }
  return NextResponse.json(JSON.stringify(newAvatar.id), { status: 201 });
}
