import { auth } from "@/auth";
import NavBar from "@/components/NavBar";
import { Avatar, AboutUser, UserGame } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { redirect } from "next/navigation";

export default async function Home() {
  await checkAuthAndRedirect();
  const session = await auth();

  const hobbiesSet = await AboutUser.findOne({
    where: { userId: session!.user!.id! },
    attributes: ["id"],
  });
  if (!hobbiesSet) {
    redirect("/aboutme");
  }

  const avatar = Avatar.findOne({
    where: { userId: session!.user!.id! },
    attributes: ["id"],
  });
  if (!avatar) {
    redirect("/aboutme/avatar");
  }

  const userGame = await UserGame.findOne({
    where: { userId: session!.user!.id! },
    attributes: ["id"],
  });

  if (!userGame) {
    redirect("/gamecode");
  }

  redirect("/game");
}
