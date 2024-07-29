"use server";

import { Hobby } from "@/database";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  hobbies: z.string(),
  guiltyPleasures: z.string(),
  favoriteMovies: z.string(),
  favoriteMusicians: z.string(),
});

export type HobbySubmitReturnType =
  | {
      error: string;
      success: false;
    }
  | {
      error: "";
      success: true;
    };

export default async function hobbySubmit(
  prevState: HobbySubmitReturnType,
  data: FormData,
): Promise<HobbySubmitReturnType> {
  const parsedData = schema.safeParse(Object.fromEntries(data.entries()));

  if (!parsedData.success) {
    return { error: "Invalid data", success: false };
  }

  await Hobby.create(parsedData.data);

  return { success: true, error: "" };
}
