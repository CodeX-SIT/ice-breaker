import { Avatar } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { AvatarProps } from "@/components/AvatarPreview";
type AvatarRouterParams = {
  params: {
    userId: string;
  };
};

export async function GET(
  request: NextRequest, // needs request function argument due to format of the GET function
  { params }: AvatarRouterParams,
) {
  const result = await Avatar.findOne({ where: { userId: params.userId } });
  return new NextResponse(JSON.stringify(result, null, 2));
}

export async function POST(
  request: NextRequest,
  { params }: AvatarRouterParams,
) {
  const body: AvatarProps | null = await request.json();
  if (!body) {
    return new NextResponse(null, { status: 400 });
  }

  // implement zod parsing for body, and validate user id
  const { userId } = params;
  const avatar = await Avatar.findOne({ where: { userId } });
  let newAvatar: Avatar;
  if (avatar) {
    newAvatar = await avatar.update({ ...body });
  } else {
    newAvatar = await Avatar.create({ ...body, userId });
  }
  return new NextResponse(JSON.stringify(newAvatar.id), { status: 201 });
}
