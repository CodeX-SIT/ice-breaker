import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Sequelize, { AccountInstance } from "./adapter";
import { sequelize, User, Account } from "@/database";
import { ModelStatic } from "sequelize";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not set");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not set");
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: Sequelize(sequelize, {
    models: {
      User: User,
    },
    synchronize: true,
  }),
});
