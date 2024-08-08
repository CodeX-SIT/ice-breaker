import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes,
} from "sequelize";
import { sequelize } from "./sequelize";

export class UserGame extends Model<
  InferAttributes<UserGame>,
  InferCreationAttributes<UserGame>
> {
  public declare id: CreationOptional<number>;
  public declare userId: ForeignKey<string>;
  public declare gameCodeId: ForeignKey<number>;
}

UserGame.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  },
  { sequelize, tableName: "user_games", modelName: "UserGame" },
);
