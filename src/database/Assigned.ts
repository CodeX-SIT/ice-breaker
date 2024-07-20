import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./sequelize";
import "server-only";
import User from "./User";

class Assigned extends Model<
  InferAttributes<Assigned>,
  InferCreationAttributes<Assigned>
> {
  public declare id: CreationOptional<number>;
  public declare userId: ForeignKey<number>;
  public declare assignedUserId: ForeignKey<number>;
  public declare completedAt: Date;
  public declare assignedAt: Date;
  public declare isCompleted: boolean;
  // public declare isSkipped: boolean;
}

Assigned.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    assignedUserId: { type: DataTypes.INTEGER, allowNull: false },
    assignedAt: { type: DataTypes.DATE, allowNull: false },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // isSkipped: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // },
  },
  { sequelize, tableName: "assigned" },
);



export default Assigned;
