import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";
import { createHash, randomBytes } from "crypto";
import { User } from ".";

export class GameCode extends Model<
  InferAttributes<GameCode>,
  InferCreationAttributes<GameCode>
> {
  public declare id: CreationOptional<number>;
  public declare code: CreationOptional<string>;
  public declare expiry: CreationOptional<Date>;
  public declare startedAt: CreationOptional<Date>;
  public declare endedAt: CreationOptional<Date | null>;
  public declare userId: ForeignKey<string>;
  public declare users: NonAttribute<User[]>;

  public static async validateGameCode(code: string): Promise<boolean> {
    const gameCode = await this.findOne({ where: { code } });

    if (!gameCode) {
      return false; // Code does not exist
    }

    if (new Date() > gameCode.expiry) {
      return false; // Code expired
    }

    return true; // Code is valid
  }

  public async endGame(): Promise<GameCode> {
    await this.update({ endedAt: new Date() });
    return this;
  }
}

GameCode.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: () => {
        const date = new Date();
        const hash = createHash("sha1");
        hash.update(randomBytes(8));
        hash.update(date.toISOString());
        return hash.digest("hex").slice(0, 5);
      },
    },
    expiry: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    startedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    endedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  },
  {
    sequelize,
    tableName: "game_codes",
    modelName: "GameCode",
  },
);
