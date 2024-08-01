import { auth } from "@/auth";
import NavBar from "@/components/NavBar";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }
  return <NavBar />;
}
