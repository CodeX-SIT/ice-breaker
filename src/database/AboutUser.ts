import { sequelize } from "./sequelize";
import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";

export class AboutUser extends Model<
  InferAttributes<AboutUser>,
  InferCreationAttributes<AboutUser>
> {
  public declare id: CreationOptional<number>;
  public declare name: string;
  public declare dateOfBirth: Date;
  public declare homeTown: string;
  public declare hobbies: string;
  public declare guiltyPleasures: string;
  public declare favoriteMovies: string;
  public declare favoriteSongs: string;
  public declare userId: ForeignKey<string>;
}

AboutUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dateOfBirth: { type: DataTypes.DATE },
    name: { type: DataTypes.STRING },
    homeTown: { type: DataTypes.STRING },
    hobbies: { type: DataTypes.TEXT("medium") },
    guiltyPleasures: { type: DataTypes.TEXT("medium") },
    favoriteMovies: { type: DataTypes.TEXT("medium") },
    favoriteSongs: { type: DataTypes.TEXT("medium") },
  },
  { sequelize, tableName: "about_user", modelName: "AboutUser" },
);
