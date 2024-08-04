import { redirect } from "next/navigation";
import { auth } from "@/auth";
import GamePage from "./SelfAvatar";

export default async function () {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  return <GamePage userId={session.user.id} />;
}
