import { auth } from "@/auth";
import { Hobby } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  hobbies: z.string(),
  guiltyPleasures: z.string(),
  favoriteMovies: z.string(),
  favoriteSongs: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (!session.user) return new NextResponse("Unauthorized", { status: 403 });
  if (!session.user.id)
    return new NextResponse("Unauthorized", { status: 403 });

  let parsedData;
  try {
    const data = await req.json();
    parsedData = schema.parse(data);
  } catch (error) {
    return new NextResponse("Invalid data", { status: 400 });
  }

  if (!parsedData) return new NextResponse("Invalid data", { status: 400 });

  const { hobbies, guiltyPleasures, favoriteMovies, favoriteSongs } =
    parsedData;

  const newHobby = await Hobby.create({
    favoriteMovies,
    favoriteSongs,
    guiltyPleasures,
    hobbies,
    userId: session.user.id!,
  });

  await newHobby.save();

  return new NextResponse(null, { status: 201 });
}
