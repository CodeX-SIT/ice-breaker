import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";

export class Avatar extends Model<
  InferAttributes<Avatar>,
  InferCreationAttributes<Avatar>
> {
  public declare id: CreationOptional<number>;
  public declare avatarStyle: string;
  public declare topType: string;
  public declare skinColor: string;
  public declare eyeType: string;
  public declare eyebrowType: string;
  public declare accessoriesType: string;
  public declare mouthType: string;
  public declare hairColor: string;
  public declare facialHairType: string;
  public declare facialHairColor: string;
  public declare clotheType: string;
  public declare clotheColor: string;
  public declare userId: ForeignKey<string>
}

Avatar.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    avatarStyle: { type: DataTypes.STRING },
    topType: { type: DataTypes.STRING },
    skinColor: { type: DataTypes.STRING },
    eyeType: { type: DataTypes.STRING },
    eyebrowType: { type: DataTypes.STRING },
    accessoriesType: { type: DataTypes.STRING },
    mouthType: { type: DataTypes.STRING },
    hairColor: { type: DataTypes.STRING },
    facialHairType: { type: DataTypes.STRING },
    facialHairColor: { type: DataTypes.STRING },
    clotheType: { type: DataTypes.STRING },
    clotheColor: { type: DataTypes.STRING },
  },
  { sequelize, tableName: "avatars", modelName: "Avatar" },
);
