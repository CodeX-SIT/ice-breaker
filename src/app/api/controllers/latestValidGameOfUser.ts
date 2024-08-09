import { GameCode, UserGame } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function latestValidGameCodeOfUser(userId: string) {
  const userGame = await UserGame.findOne({
    where: { userId: userId },
    order: [["createdAt", "DESC"]],
  });
  if (!userGame) return;
  const gameCode = await GameCode.findOne({
    where: { id: userGame.gameCodeId, endedAt: null },
  });
  if (!gameCode) return;
  return gameCode;
}
