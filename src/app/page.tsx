import { auth } from "@/auth";
import NavBar from "@/components/NavBar";
import { Avatar, AboutUser, UserGame, GameCode } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { redirect } from "next/navigation";
import latestValidGameCodeOfUser from "./api/controllers/latestValidGameOfUser";
import { ADMINS } from "@/constants";

export default async function Home() {
  await checkAuthAndRedirect();
  const session = await auth();

  if (ADMINS.includes(session!.user!.email!)) {
    redirect("/gamecode");
  }

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

  const latestGame = await latestValidGameCodeOfUser(session!.user!.id!);

  if (latestGame) {
    redirect(`/game/${latestGame.code}`);
  }
  redirect("/gamecode");
}
