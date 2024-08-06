import { auth } from "@/auth";
import { redirect, RedirectType } from "next/navigation";
import SignInPage from "./SignInPage";

export default async function SignIn() {
  const session = await auth();
  if (session) {
    redirect("/", RedirectType.replace);
  }
  return <SignInPage />;
}
