import { AboutUser } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  dateOfBirth: z.date({ coerce: true }),
  homeTown: z.string(),
  hobbies: z.string(),
  guiltyPleasures: z.string(),
  favoriteMovies: z.string(),
  favoriteSongs: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await checkAuthAndRedirect();

  let parsedData;
  try {
    const formData = await req.formData();
    parsedData = schema.parse({
      name: formData.get("name"),
      dateOfBirth: formData.get("dateOfBirth"),
      homeTown: formData.get("homeTown"),
      hobbies: formData.get("hobbies"),
      guiltyPleasures: formData.get("guiltyPleasures"),
      favoriteMovies: formData.get("favoriteMovies"),
      favoriteSongs: formData.get("favoriteSongs"),
    });
  } catch (error) {
    console.error("Error parsing data", error);
    return new NextResponse("Invalid data", { status: 400 });
  }

  if (!parsedData) return new NextResponse("Invalid data", { status: 400 });

  const {
    name,
    dateOfBirth,
    homeTown,
    hobbies,
    guiltyPleasures,
    favoriteMovies,
    favoriteSongs,
  } = parsedData;

  const prevHobbies = await AboutUser.findOne({
    where: { userId: session.user!.id },
  });

  if (prevHobbies) {
    await prevHobbies.update({
      name: name ?? prevHobbies.name,
      dateOfBirth: dateOfBirth ?? prevHobbies.dateOfBirth,
      homeTown: homeTown ?? prevHobbies.homeTown,
      hobbies: hobbies ?? prevHobbies.hobbies,
      guiltyPleasures: guiltyPleasures ?? prevHobbies.guiltyPleasures,
      favoriteMovies: favoriteMovies ?? prevHobbies.favoriteMovies,
      favoriteSongs: favoriteSongs ?? prevHobbies.favoriteSongs,
    });

    return NextResponse.json(prevHobbies.id ?? null, { status: 200 });
  }

  const newHobby = await AboutUser.create({
    name,
    dateOfBirth,
    homeTown,
    favoriteMovies,
    favoriteSongs,
    guiltyPleasures,
    hobbies,
    userId: session.user!.id!,
  });

  return NextResponse.json(newHobby.id ?? null, { status: 201 });
}
