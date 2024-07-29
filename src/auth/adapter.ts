import { User } from "@/database";
import { Awaitable } from "@auth/core/types";
import { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";

class SequelizeAdapter implements Adapter {
  async createUser(user: AdapterUser): Promise<AdapterUser> {
    await User.create({ ...user });
    return user;
  }
  async getUser(id: string): Promise<AdapterUser | null> {
    const user = await User.findByPk(id);
    const adapterUser: AdapterUser | null = user
      ? {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          name: user.name,
        }
      : null;
    return adapterUser;
  }
  // getUserByAccount(
  //   providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">,
  // ): Promise<AdapterUser | null> {
    
  // }
}
