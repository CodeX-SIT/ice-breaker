import { User } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export async function POST(request: NextRequest) {
  if (!request.body) {
    const response = new NextResponse(
      "Bad Request" + process.env.NODE_ENV === "production"
        ? ""
        : "Request body missing",
      {
        status: 400,
      },
    );
    return response;
  }

  const { firstName, lastName, email, password, passwordVerify } =
    await request.json();

  const result = schema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });

  const emailDomain = email.split("@")[1].trim();
  if (!(emailDomain === "sitpune.edu.in")) {
    return new NextResponse("Invalid email domain", {
      status: 422,
    });
  }

  const foundUser = await User.findOne({
    where: {
      email,
    },
  });

  if (foundUser) {
    return new NextResponse("User already exists", {
      status: 409,
    });
  }

  if (password !== passwordVerify) {
    return new NextResponse("Passwords do not match", {
      status: 422,
    });
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });
  await user.save();

}
