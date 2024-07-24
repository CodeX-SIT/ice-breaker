import { ZodIssue } from "zod";

export type UserLoginResponse = {
  status: number;
  body: {
    message: string;
    errors?: ZodIssue[];
    token?: string;
  };
};
