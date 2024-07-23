"use server";
import { ZodIssue } from "zod";

export type UserCreateResponse =
  | {
      status: 201;
      body: {
        message: string;
        token: string;
      };
    }
  | {
      status: 400;
      body: {
        message: string;
        errors: ZodIssue[];
      };
    }
  | {
      status: 409;
      body: {
        message: string;
        errors: [];
      };
    }
  | {
      status: 0;
      body: {
        message: string;
        errors: [];
      };
    };
