"use server";

import { AboutUser } from "@/database";
import _HobbiesPage from "./HobbiesPage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function HobbiesPage() {
  const session = await checkAuthAndRedirect();
  const prevHobbies = await AboutUser.findOne({
    where: { userId: session.user!.id },
  });
  return (
    <_HobbiesPage previousAboutMe={prevHobbies ? prevHobbies.get() : null} />
  );
}
