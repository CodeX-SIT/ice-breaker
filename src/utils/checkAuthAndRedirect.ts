import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function checkAuthAndRedirect() {
  const session = await auth();

  if (!session) redirect("/auth/signin");
  if (!session.user) redirect("/auth/signin");
  if (!session.user.id) redirect("/auth/signin");

  return session;
}
