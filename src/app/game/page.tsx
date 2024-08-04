import { redirect } from "next/navigation";
import { auth } from "@/auth";
import _GamePage from "./SelfAvatar";

export default async function GamePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  return <_GamePage userId={session.user.id} />;
}
