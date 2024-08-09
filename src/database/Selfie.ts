import {
  InferCreationAttributes,
  Model,
  InferAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";
import { Assigned } from ".";

export class Selfie extends Model<
  InferAttributes<Selfie>,
  InferCreationAttributes<Selfie>
> {
  public declare id: CreationOptional<number>;
  public declare data: Buffer;
  public declare mimeType: string;
  public declare assignedId: ForeignKey<number>;
  public declare assigned?: ForeignKey<Assigned>;
}

Selfie.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    data: { type: DataTypes.BLOB("medium"), allowNull: false },
    mimeType: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "selfies", modelName: "Selfie" },
);
