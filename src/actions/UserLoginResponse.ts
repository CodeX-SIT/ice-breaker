import { ZodError, ZodIssue } from "zod";

export type UserLoginResponse = {
  status: number;
  body: {
    message: string;
    error?: ZodError;
    token?: string;
  };
};
