import { z } from "zod";
import { UserLoginResponse } from "./UserLoginResponse";
import { User } from "@/database";
import { createHash } from "crypto";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export default async function loginUser(
  prevState: UserLoginResponse,
  data: FormData,
): Promise<UserLoginResponse> {
  const email = data.get("email");
  const password = data.get("password");

  const result = schema.safeParse({ email, password });

  if (!result.success) {
    return {
      status: 400,
      body: {
        message: "Invalid data",
        errors: result.error.errors,
      },
    };
  }

  const emailDomain = result.data.email.split("@")[1];
  if (emailDomain !== "sitpune.edu.in") {
    return {
      status: 400,
      body: {
        message: "Please use SIT Pune email",
      },
    };
  }

  const user = await User.findOne({ where: { email: result.data.email } });

  if (!user) {
    return {
      status: 404,
      body: {
        message: "No account with this email exists.",
      },
    };
  }

  const hash = createHash("sha256")
    .update(result.data.password + result.data.email)
    .digest("hex");

  if (hash !== user.password) {
    return {
      status: 403,
      body: {
        message: "Invalid password.",
      },
    };
  }

  return {
    status: 200,
    body: {
      message: "Authenticated",
    },
  };
}
