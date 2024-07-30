import "server-only";
import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";

export class Assigned extends Model<
  InferAttributes<Assigned>,
  InferCreationAttributes<Assigned>
> {
  public declare id: CreationOptional<number>;
  public declare userId: ForeignKey<number>;
  public declare assignedUserId: ForeignKey<number>;
  public declare completedAt: Date | null;
  public declare assignedAt: Date;
  public declare isCompleted: boolean;
  // public declare selfie: Buffer | null;
}

Assigned.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    assignedAt: { type: DataTypes.DATE, allowNull: false },
    completedAt: { type: DataTypes.DATE },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // selfie: { type: DataTypes.BLOB("medium") },
    // isSkipped: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // },
  },
  { sequelize, tableName: "assigned" },
);
