import "server-only";
import { sequelize } from "./sequelize";
import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { randomUUID } from "crypto";

export class Hobby extends Model<
  InferAttributes<Hobby>,
  InferCreationAttributes<Hobby>
> {
  public declare id: CreationOptional<string>;
  public declare hobbies: string;
  public declare guiltyPleasures: string;
  public declare favoriteMovies: string;
  public declare favoriteSongs: string;
  public declare userId: ForeignKey<string>;
}

Hobby.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      set(val) {
        return randomUUID();
      },
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    hobbies: { type: DataTypes.TEXT("medium"), allowNull: false },
    guiltyPleasures: { type: DataTypes.TEXT("medium"), allowNull: false },
    favoriteMovies: { type: DataTypes.TEXT("medium"), allowNull: false },
    favoriteSongs: { type: DataTypes.TEXT("medium"), allowNull: false },
  },
  { sequelize, tableName: "hobbies" },
);
