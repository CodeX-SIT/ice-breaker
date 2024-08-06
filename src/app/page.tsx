import { auth } from "@/auth";
import NavBar from "@/components/NavBar";
import { Avatar, AboutUser, UserGame, GameCode } from "@/database";
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
    order: [["createdAt", "DESC"]],
  });

  if (!userGame) {
    redirect("/gamecode");
  }

  const gameCode = (
    await GameCode.findOne({
      where: { id: userGame.gameCodeId, endedAt: null },
      attributes: ["code"],
    })
  )?.code;

  gameCode ? redirect(`/game/${gameCode}`) : redirect("/gamecode");
}
