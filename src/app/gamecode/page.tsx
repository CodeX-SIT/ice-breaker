"use server";
import { redirect } from "next/navigation";
import { _GameCodePage } from "./GamePage";
import { auth } from "@/auth";

export default async function GameCodePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  return <_GameCodePage />;
}
