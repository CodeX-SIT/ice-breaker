import { User } from "@/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });
  await user.save();

  return NextResponse.redirect(new URL("/", request.url).toString());
}
