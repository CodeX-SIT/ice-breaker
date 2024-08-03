"use server";
import { _GameCodePage } from "./GamePage";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";

export default async function GameCodePage() {
  await checkAuthAndRedirect();
  return <_GameCodePage />;
}
