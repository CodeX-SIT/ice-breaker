import { redirect } from "next/navigation";
import { auth } from "@/auth";
import _GamePage from "./GamePage";

export default async function GamePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  return <_GamePage />;
}
