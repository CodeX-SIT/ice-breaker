import { NextResponse } from "next/server";
import { Avatar } from "../../../database/Avatar";

//TODO: zod validation

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const avatar = await Avatar.create(body);
    return NextResponse.json(avatar);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating avatar" },
      { status: 500 },
    );
  }
}
