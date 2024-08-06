"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function signOutAction() {
  signOut({ redirect: false });
  redirect("/");
}
