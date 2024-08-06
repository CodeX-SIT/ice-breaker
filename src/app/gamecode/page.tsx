"use server";
import { ADMINS } from "@/constants";
import { _GameCodePage } from "./GamePage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import AdminGameCode from "./AdminGameCode";

export default async function GameCodePage() {
  const session = await checkAuthAndRedirect();
  if (ADMINS.includes(session.user?.email ?? "")) {
    return <AdminGameCode />;
  } else return <_GameCodePage />;
}
