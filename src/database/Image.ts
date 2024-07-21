import {
  InferCreationAttributes,
  Model,
  InferAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "./sequelize";

class Image extends Model<
  InferAttributes<Image>,
  InferCreationAttributes<Image>
> {
  public declare id: CreationOptional<number>;
  public declare data: Buffer;
  public declare mimeType: string;
}

Image.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    data: { type: DataTypes.BLOB("medium"), allowNull: false },
    mimeType: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "images" },
);
