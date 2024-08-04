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
  public declare favoriteSongs: string;
  public declare userId: ForeignKey<string>;
}

Hobby.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    hobbies: { type: DataTypes.TEXT("medium"), allowNull: false },
    guiltyPleasures: { type: DataTypes.TEXT("medium"), allowNull: false },
    favoriteMovies: { type: DataTypes.TEXT("medium"), allowNull: false },
    favoriteSongs: { type: DataTypes.TEXT("medium"), allowNull: false },
  },
  { sequelize, tableName: "hobbies" },
);
