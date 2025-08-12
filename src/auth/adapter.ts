import "server-only";

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters";
import {
  Sequelize,
  Model,
  ModelCtor,
  ModelStatic,
  SyncOptions,
} from "sequelize";
import * as defaultModels from "./models";

export { defaultModels as models };

// @see https://sequelize.org/master/manual/typescript.html
//@ts-expect-error
export interface AccountInstance
  extends Model<AdapterAccount, Partial<AdapterAccount>>,
    AdapterAccount {}
export interface UserInstance
  extends Model<AdapterUser, Partial<AdapterUser>>,
    AdapterUser {}
export interface SessionInstance
  extends Model<AdapterSession, Partial<AdapterSession>>,
    AdapterSession {}
export interface VerificationTokenInstance
  extends Model<VerificationToken, Partial<VerificationToken>>,
    VerificationToken {}

/** This is the interface of the Sequelize adapter options. */
export interface SequelizeAdapterOptions {
  /**
   * If set to `true`, the adapter will synchronize the models with the database.
   * If set to `false`, the adapter will not synchronize the models with the database.
   * If set to an object, the adapter will pass the object as the options to the `sync` method.
   */
  synchronize?: boolean;
  /**
   * The models to use in the adapter.
   */
  models?: Partial<{
    User: ModelStatic<UserInstance>;
    Account: ModelStatic<AccountInstance>;
    Session: ModelStatic<SessionInstance>;
    VerificationToken: ModelStatic<VerificationTokenInstance>;
  }>;
}

export default function SequelizeAdapter(
  client: Sequelize,
  options?: SequelizeAdapterOptions,
): Adapter {
  console.log("in SequelizeAdapter - initializing adapter");
  const { models, synchronize = true } = options ?? {};
  console.log("in SequelizeAdapter - parsing options", {
    models: !!models,
    synchronize,
  });
  const defaultModelOptions = { underscored: true, timestamps: false };
  console.log("in SequelizeAdapter - defining models");
  const { User, Account, Session, VerificationToken } = {
    User:
      models?.User ??
      client.define<UserInstance>(
        "user",
        defaultModels.User,
        defaultModelOptions,
      ),
    Account:
      models?.Account ??
      client.define<AccountInstance>(
        "account",
        defaultModels.Account,
        defaultModelOptions,
      ),
    Session:
      models?.Session ??
      client.define<SessionInstance>(
        "session",
        defaultModels.Session,
        defaultModelOptions,
      ),
    VerificationToken:
      models?.VerificationToken ??
      client.define<VerificationTokenInstance>(
        "verificationToken",
        defaultModels.VerificationToken,
        defaultModelOptions,
      ),
  };
  console.log("in SequelizeAdapter - models defined successfully");
  let _synced = false;
  const sync = async () => {
    console.log("in sync - starting sync process", { synchronize, _synced });
    if (synchronize && !_synced) {
      console.log("in sync - performing database sync");

      const syncOptions: SyncOptions = {
        // force: process.env.NODE_ENV === "production",
      };

      try {
        // Import all application models to ensure they are registered
        const {
          AboutUser,
          Avatar,
          GameCode,
          UserGame,
          Assigned,
          Selfie,
          Achievement,
          FlashEvent,
          UserAchievement,
        } = await import("@/database");

        console.log("in sync - syncing User model");
        await User.sync(syncOptions);
        console.log("in sync - syncing Account model");
        await Account.sync(syncOptions);
        console.log("in sync - syncing Session model");
        await Session.sync(syncOptions);
        console.log("in sync - syncing VerificationToken model");
        await VerificationToken.sync(syncOptions);

        // Sync application models
        console.log("in sync - syncing AboutUser model");
        await AboutUser.sync(syncOptions);
        console.log("in sync - syncing Avatar model");
        await Avatar.sync(syncOptions);
        console.log("in sync - syncing GameCode model");
        await GameCode.sync(syncOptions);
        console.log("in sync - syncing UserGame model");
        await UserGame.sync(syncOptions);
        console.log("in sync - syncing Assigned model");
        await Assigned.sync(syncOptions);
        console.log("in sync - syncing Selfie model");
        await Selfie.sync(syncOptions);
        console.log("in sync - syncing Achievement model");
        await Achievement.sync(syncOptions);
        console.log("in sync - syncing UserAchievement model");
        await UserAchievement.sync(syncOptions);
        console.log("in sync - syncing FlashEvent model");
        await FlashEvent.sync(syncOptions);

        console.log("in sync - all models synced successfully");
        _synced = true;
      } catch (error) {
        console.error("in sync - error during sync:", error);
        throw error;
      }
    } else {
      console.log(
        "in sync - skipping sync (already synced or synchronize=false)",
      );
    }
  };

  console.log("in SequelizeAdapter - setting up model relationships");
  Account.belongsTo(User, { onDelete: "cascade" });
  Session.belongsTo(User, { onDelete: "cascade" });
  console.log("in SequelizeAdapter - model relationships set up successfully");

  return {
    async createUser(user) {
      console.log("in createUser - starting", { user });
      try {
        await sync();
        console.log("in createUser - sync completed, creating user");
        const result = await User.create(user);
        console.log("in createUser - user created successfully", {
          userId: result.id,
        });
        return result;
      } catch (error) {
        console.error("in createUser - error:", error);
        throw error;
      }
    },
    async getUser(id) {
      console.log("in getUser - starting", { id });
      try {
        await sync();
        console.log("in getUser - sync completed, finding user by id");
        const userInstance = await User.findByPk(id);
        console.log("in getUser - user found:", { found: !!userInstance });
        const result = userInstance?.get({ plain: true }) ?? null;
        console.log("in getUser - returning result", { hasResult: !!result });
        return result;
      } catch (error) {
        console.error("in getUser - error:", error);
        throw error;
      }
    },
    async getUserByEmail(email) {
      console.log("in getUserByEmail - starting", { email });
      try {
        await sync();
        console.log(
          "in getUserByEmail - sync completed, finding user by email",
        );
        const userInstance = await User.findOne({
          where: { email },
        });
        console.log("in getUserByEmail - user found:", {
          found: !!userInstance,
        });
        const result = userInstance?.get({ plain: true }) ?? null;
        console.log("in getUserByEmail - returning result", {
          hasResult: !!result,
        });
        return result;
      } catch (error) {
        console.error("in getUserByEmail - error:", error);
        throw error;
      }
    },
    async getUserByAccount({ provider, providerAccountId }) {
      console.log("in getUserByAccount - starting", {
        provider,
        providerAccountId,
      });
      try {
        await sync();
        console.log("in getUserByAccount - sync completed, finding account");
        const accountInstance = await Account.findOne({
          // @ts-expect-error
          where: { provider, providerAccountId },
        }).catch((e) => {
          console.error("in getUserByAccount - error finding account:", e);
          if (e instanceof Error) {
            console.error(e.stack);
          }
          return null;
        });

        console.log(
          "in getUserByAccount - account lookup result:",
          JSON.stringify(accountInstance, null, 2),
        );

        if (!accountInstance) {
          console.log("in getUserByAccount - no account found, returning null");
          return null;
        }

        console.log(
          "in getUserByAccount - finding user by userId:",
          accountInstance.userId,
        );
        const userInstance = await User.findByPk(accountInstance.userId);
        console.log("in getUserByAccount - user found:", {
          found: !!userInstance,
        });
        const result = userInstance?.get({ plain: true }) ?? null;
        console.log("in getUserByAccount - returning result", {
          hasResult: !!result,
        });
        return result;
      } catch (error) {
        console.error("in getUserByAccount - error:", error);
        throw error;
      }
    },
    async updateUser(user) {
      console.log("in updateUser - starting", { userId: user.id });
      try {
        await sync();
        console.log("in updateUser - sync completed, updating user");
        await User.update(user, { where: { id: user.id } });
        console.log("in updateUser - user updated, finding updated user");
        const userInstance = await User.findByPk(user.id);
        console.log("in updateUser - returning updated user");
        return userInstance!;
      } catch (error) {
        console.error("in updateUser - error:", error);
        throw error;
      }
    },
    async deleteUser(userId) {
      console.log("in deleteUser - starting", { userId });
      try {
        await sync();
        console.log("in deleteUser - sync completed, finding user");
        const userInstance = await User.findByPk(userId);
        console.log("in deleteUser - user found:", { found: !!userInstance });
        console.log("in deleteUser - deleting user");
        await User.destroy({ where: { id: userId } });
        console.log("in deleteUser - user deleted successfully");
        return userInstance;
      } catch (error) {
        console.error("in deleteUser - error:", error);
        throw error;
      }
    },
    async linkAccount(account) {
      console.log("in linkAccount - starting", { account });
      try {
        await sync();
        console.log("in linkAccount - sync completed, creating account");
        await Account.create(account);
        console.log("in linkAccount - account created successfully");
      } catch (e) {
        console.error("in linkAccount - error:", e);
        if (e instanceof Error) {
          console.error(e.stack);
        }
        throw e;
      }
    },
    async unlinkAccount({ provider, providerAccountId }) {
      console.log("in unlinkAccount - starting", {
        provider,
        providerAccountId,
      });
      try {
        await sync();
        console.log("in unlinkAccount - sync completed, deleting account");
        await Account.destroy({
          where: { provider, providerAccountId } as any,
        });
        console.log("in unlinkAccount - account deleted successfully");
      } catch (error) {
        console.error("in unlinkAccount - error:", error);
        throw error;
      }
    },
    async createSession(session) {
      console.log("in createSession - starting", { session });
      try {
        await sync();
        console.log("in createSession - sync completed, creating session");
        const result = await Session.create(session);
        console.log("in createSession - session created successfully");
        return result;
      } catch (error) {
        console.error("in createSession - error:", error);
        throw error;
      }
    },
    async getSessionAndUser(sessionToken) {
      console.log("in getSessionAndUser - starting", { sessionToken });
      try {
        await sync();
        console.log("in getSessionAndUser - sync completed, finding session");
        const sessionInstance = await Session.findOne({
          where: { sessionToken },
        }).catch((e) => {
          console.error("in getSessionAndUser - error finding session:", e);
          if (e instanceof Error) {
            console.error(e.stack);
          }
          return;
        });

        if (!sessionInstance) {
          console.log(
            "in getSessionAndUser - no session found, returning null",
          );
          return null;
        }

        console.log("in getSessionAndUser - session found, finding user");
        const userInstance = await User.findByPk(sessionInstance.userId);

        if (!userInstance) {
          console.log(
            "in getSessionAndUser - user not found for session, returning null",
          );
          return null;
        }

        console.log(
          "in getSessionAndUser - both session and user found, returning both",
        );
        return {
          session: sessionInstance?.get({ plain: true }),
          user: userInstance?.get({ plain: true }),
        };
      } catch (error) {
        console.error("in getSessionAndUser - error:", error);
        throw error;
      }
    },
    async updateSession({ sessionToken, expires }) {
      console.log("in updateSession - starting", { sessionToken, expires });
      try {
        await sync();
        console.log("in updateSession - sync completed, updating session");
        await Session.update(
          { expires, sessionToken },
          { where: { sessionToken } },
        );
        console.log(
          "in updateSession - session updated, finding updated session",
        );
        const result = await Session.findOne({ where: { sessionToken } });
        console.log("in updateSession - returning updated session");
        return result;
      } catch (error) {
        console.error("in updateSession - error:", error);
        throw error;
      }
    },
    async deleteSession(sessionToken) {
      console.log("in deleteSession - starting", { sessionToken });
      try {
        await sync();
        console.log("in deleteSession - sync completed, finding session");
        const session = await Session.findOne({ where: { sessionToken } });
        console.log("in deleteSession - session found:", { found: !!session });
        console.log("in deleteSession - deleting session");
        await Session.destroy({ where: { sessionToken } });
        console.log("in deleteSession - session deleted successfully");
        return session?.get({ plain: true });
      } catch (error) {
        console.error("in deleteSession - error:", error);
        throw error;
      }
    },
    async createVerificationToken(token) {
      console.log("in createVerificationToken - starting", { token });
      try {
        await sync();
        console.log(
          "in createVerificationToken - sync completed, creating token",
        );
        const result = await VerificationToken.create(token);
        console.log("in createVerificationToken - token created successfully");
        return result;
      } catch (error) {
        console.error("in createVerificationToken - error:", error);
        throw error;
      }
    },
    async useVerificationToken({ identifier, token }) {
      console.log("in useVerificationToken - starting", { identifier, token });
      try {
        await sync();
        console.log("in useVerificationToken - sync completed, finding token");
        const tokenInstance = await VerificationToken.findOne({
          where: { identifier, token },
        });
        console.log("in useVerificationToken - token found:", {
          found: !!tokenInstance,
        });
        console.log("in useVerificationToken - destroying token");
        await VerificationToken.destroy({ where: { identifier } });
        console.log("in useVerificationToken - token destroyed successfully");
        const result = tokenInstance?.get({ plain: true }) ?? null;
        console.log("in useVerificationToken - returning result", {
          hasResult: !!result,
        });
        return result;
      } catch (error) {
        console.error("in useVerificationToken - error:", error);
        throw error;
      }
    },
  };
}
