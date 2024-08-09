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
  const { models, synchronize = true } = options ?? {};
  const defaultModelOptions = { underscored: true, timestamps: false };
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
  let _synced = false;
  const sync = async () => {
    if (synchronize && !_synced) {
      const syncOptions: SyncOptions = {
        // force: process.env.NODE_ENV === "production",
      };

      await Promise.all([
        User.sync(syncOptions),
        Account.sync(syncOptions),
        Session.sync(syncOptions),
        VerificationToken.sync(syncOptions),
      ]);

      _synced = true;
    }
  };

  Account.belongsTo(User, { onDelete: "cascade" });
  Session.belongsTo(User, { onDelete: "cascade" });

  return {
    async createUser(user) {
      await sync();

      return await User.create(user);
    },
    async getUser(id) {
      await sync();

      const userInstance = await User.findByPk(id);

      return userInstance?.get({ plain: true }) ?? null;
    },
    async getUserByEmail(email) {
      await sync();

      const userInstance = await User.findOne({
        where: { email },
      });

      return userInstance?.get({ plain: true }) ?? null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      await sync();

      const accountInstance = await Account.findOne({
        // @ts-expect-error
        where: { provider, providerAccountId },
      }).catch((e) => {
        console.error(e);
        console.error(e.stack);
        return null;
      });

      console.log(JSON.stringify(accountInstance, null, 2));

      if (!accountInstance) {
        return null;
      }

      const userInstance = await User.findByPk(accountInstance.userId);

      return userInstance?.get({ plain: true }) ?? null;
    },
    async updateUser(user) {
      await sync();

      await User.update(user, { where: { id: user.id } });
      const userInstance = await User.findByPk(user.id);

      return userInstance!;
    },
    async deleteUser(userId) {
      await sync();

      const userInstance = await User.findByPk(userId);

      await User.destroy({ where: { id: userId } });

      return userInstance;
    },
    async linkAccount(account) {
      await sync();

      await Account.create(account).catch((e) => {
        console.error(e);
        console.error(e.stack);
      });
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await sync();

      await Account.destroy({
        where: { provider, providerAccountId },
      });
    },
    async createSession(session) {
      await sync();

      return await Session.create(session);
    },
    async getSessionAndUser(sessionToken) {
      await sync();

      const sessionInstance = await Session.findOne({
        where: { sessionToken },
      }).catch((e) => {
        console.error(e);
        console.error(e.stack);
        return;
      });

      if (!sessionInstance) {
        return null;
      }

      const userInstance = await User.findByPk(sessionInstance.userId);

      if (!userInstance) {
        return null;
      }

      return {
        session: sessionInstance?.get({ plain: true }),
        user: userInstance?.get({ plain: true }),
      };
    },
    async updateSession({ sessionToken, expires }) {
      await sync();

      await Session.update(
        { expires, sessionToken },
        { where: { sessionToken } },
      );

      return await Session.findOne({ where: { sessionToken } });
    },
    async deleteSession(sessionToken) {
      await sync();

      const session = await Session.findOne({ where: { sessionToken } });
      await Session.destroy({ where: { sessionToken } });
      return session?.get({ plain: true });
    },
    async createVerificationToken(token) {
      await sync();

      return await VerificationToken.create(token);
    },
    async useVerificationToken({ identifier, token }) {
      await sync();

      const tokenInstance = await VerificationToken.findOne({
        where: { identifier, token },
      });

      await VerificationToken.destroy({ where: { identifier } });

      return tokenInstance?.get({ plain: true }) ?? null;
    },
  };
}
