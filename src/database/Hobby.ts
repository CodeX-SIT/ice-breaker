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

export class Hobby extends Model<
  InferAttributes<Hobby>,
  InferCreationAttributes<Hobby>
> {
  public declare id: CreationOptional<number>;
  public declare hobbies: string;
  public declare guiltyPleasures: string;
  public declare favoriteMovies: string;
  public declare favoriteMusicians: string;
  // public declare userId: ForeignKey<number>;
}

Hobby.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    hobbies: { type: DataTypes.STRING, allowNull: false },
    guiltyPleasures: { type: DataTypes.STRING, allowNull: false },
    favoriteMovies: { type: DataTypes.STRING, allowNull: false },
    favoriteMusicians: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "hobbies" },
);
