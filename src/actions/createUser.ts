"use server";

import { User } from "@/database";
import { stat } from "fs";
import { z } from "zod";

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default async function createUser(data: FormData) {
  const firstName = data.get("firstName");
  const lastName = data.get("lastName");
  const email = data.get("email");
  const password = data.get("password");

  const result = schema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });

  const passwordVerify = data.get("passwordVerify");

  if (password !== passwordVerify) {
    return {
      status: 400,
      body: {
        message: "Passwords do not match",
      },
    };
  }

  if (!result.success) {
    return;
  }

  const user = new User(result.data);
  await user.save();

  return {
    status: 200,
    body: {
      message: "User created",
    },
  };
}
