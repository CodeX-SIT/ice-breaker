import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./sequelize";
import { User } from "./User";

export class Assigned extends Model<
  InferAttributes<Assigned>,
  InferCreationAttributes<Assigned>
> {
  public declare id: CreationOptional<number>;
  public declare userId: ForeignKey<string>;
  public declare assignedUserId: ForeignKey<string>;
  public declare completedAt: Date | null;
  public declare assignedAt: Date;
  public declare isSkipped: boolean;
  public declare gameCodeId: ForeignKey<number>;
  public declare user: NonAttribute<User>;
  public declare assignedUser: NonAttribute<User>;
}

Assigned.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    assignedAt: { type: DataTypes.DATE, allowNull: false },
    completedAt: { type: DataTypes.DATE },
    isSkipped: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { sequelize, tableName: "assigned", modelName:"Assigned" },
);
