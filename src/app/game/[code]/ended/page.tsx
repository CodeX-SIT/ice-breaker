"use server";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import NavBar from "@/components/NavBar";
import { getStatsForUser } from "@/app/api/controllers/getStats";
import { GameCode } from "@/database";
import { Button, Divider, Typography } from "@mui/material";
import ErrorSuccessSnackbar from "@/components/Snackbars/ErrorSuccessSnackbar";
import Ended from "./Ended";
export default async function Page({
  params,
}: {
  params: { code: string; assignedId: number };
}) {
  const session = await checkAuthAndRedirect();
  if (!session.user?.id) return;
  const userId = session.user.id!;
  const { code, assignedId } = params;
  const gameCode = await GameCode.findOne({
    where: { code: code.toLowerCase().trim() },
  });
  if (!gameCode) {
    return "Game code not found";
  }
  const result = await getStatsForUser(gameCode, userId);
  if (!result) {
    return "User not found";
  }

  return <Ended code={code} result={result} />;
}
