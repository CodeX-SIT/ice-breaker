import { auth } from "@/auth";
import { redirect } from "next/navigation";
import _HobbiesPage from "./HobbiesPage";

export default async function HobbiesPage() {
  const session = await auth();

  if (!session) redirect("/auth/signin");
  if (!session.user) redirect("/auth/signin");
  if (!session.user.id) redirect("/auth/signin");

  return <_HobbiesPage />;
}
