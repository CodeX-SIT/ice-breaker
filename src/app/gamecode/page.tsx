"use server";
import { ADMINS } from "@/constants";
import { _GameCodePage } from "./GamePage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import AdminGameCode from "./AdminGameCode";
import { AboutUser, Avatar } from "@/database";
import { redirect } from "next/navigation";
import latestValidGameCodeOfUser from "../api/controllers/latestValidGameOfUser";

export default async function GameCodePage() {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  if (ADMINS.includes(session.user?.email ?? "")) {
    return <AdminGameCode />;
  }
  // User is not an admin
  const aboutUser = await AboutUser.findOne({
    where: {
      userId,
    },
  });
  if (!aboutUser) redirect("/aboutme");
  const avatar = await Avatar.findOne({
    where: {
      userId,
    },
  });
  if (!avatar) redirect("/aboutme/avatar");

  const latestGame = await latestValidGameCodeOfUser(session!.user!.id!);
  if (latestGame) redirect(`/game/${latestGame.code}`);

  return <_GameCodePage />;
}
