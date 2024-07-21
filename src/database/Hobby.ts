import { sequelize } from "./sequelize";
import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import "server-only";

class Hobby extends Model<
  InferAttributes<Hobby>,
  InferCreationAttributes<Hobby>
> {
  public declare id: CreationOptional<number>;
  public declare userId: ForeignKey<number>;
  public declare hobby: string;
}

Hobby.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    hobby: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "hobbies" },
);

export default Hobby;
