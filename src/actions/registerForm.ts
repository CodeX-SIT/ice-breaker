"use server";

import "server-only";
import { User } from "@/database";

export default async function registerForm(formData: FormData) {
  const user = new User({
    email: formData.get("email") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    password: formData.get("password") as string,
  });
  await user.save();
}
