import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./sequelize";
import { createHash } from "crypto";
import "server-only";
import Assigned from "./Assigned";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  public declare id: string;
  public declare email: string;
  public declare emailVerified: Date | null;
  public declare image: string | null;
  public declare name: string | null;
}

User.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true },
    emailVerified: { type: DataTypes.DATE, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "users",
  },
);

export default User;
