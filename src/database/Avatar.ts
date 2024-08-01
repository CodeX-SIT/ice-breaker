import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";

class Avatar extends Model {
  public id!: number;
  public userId!: number;
  public avatarStyle!: string;
  public topType!: string;
  public accessoriesType!: string;
  public hairColor!: string;
  public facialHairType!: string;
  public facialHairColor!: string;
  public clotheType!: string;
  public clotheColor!: string;
  public eyeType!: string;
  public eyebrowType!: string;
  public mouthType!: string;
  public skinColor!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Avatar.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avatarStyle: DataTypes.STRING,
    topType: DataTypes.STRING,
    accessoriesType: DataTypes.STRING,
    hairColor: DataTypes.STRING,
    facialHairType: DataTypes.STRING,
    facialHairColor: DataTypes.STRING,
    clotheType: DataTypes.STRING,
    clotheColor: DataTypes.STRING,
    eyeType: DataTypes.STRING,
    eyebrowType: DataTypes.STRING,
    mouthType: DataTypes.STRING,
    skinColor: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Avatar',
  }
);

export { Avatar };