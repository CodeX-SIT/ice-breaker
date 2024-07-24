"use server";

import { User } from "@/database";
import { z } from "zod";
import { UserCreateResponse } from "./UserCreateResponse";
import { cookies } from "next/headers";

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default async function createUser(
  prevState: UserCreateResponse,
  data: FormData,
): Promise<UserCreateResponse> {
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

  if (!result.success) {
    return {
      status: 400,
      body: {
        message: "Invalid data",
        errors: result.error.errors,
      },
    };
  }

  const emailDomain = result.data.email.split("@")[1].trim();

  if (!(emailDomain === "sitpune.edu.in")) {
    return {
      status: 400,
      body: {
        message: "Only SIT Pune email addresses are allowed",
        errors: [],
      },
    };
  }

  const foundUser = await User.findOne({
    where: {
      email: result.data.email,
    },
  });

  if (foundUser) {
    return {
      status: 409,
      body: {
        message: "User already exists",
        errors: [],
      },
    };
  }

  if (password !== passwordVerify) {
    return {
      status: 400,
      body: {
        message: "Passwords do not match",
        errors: [],
      },
    };
  }

  const user = new User(result.data);
  await user.save();

  const cookieStore = cookies();
  cookieStore.set("token", user.token, {
    maxAge: 60 * 60 * 24 * 7,
    expires: new Date(Date.now() + 60 * 60 * 24 * 7),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return {
    status: 201,
    body: {
      message: "User created",
      token: user.token,
    },
  };
}
