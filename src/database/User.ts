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
  public declare id: CreationOptional<number>;
  public declare email: string;
  public declare firstName: string;
  public declare lastName: string;
  public declare password: string;
  public get token(): NonAttribute<string> {
    return this.password;
  }
  // public get name() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true },
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(val: string) {
        this.setDataValue(
          "password",
          createHash("sha256")
            .update(val + this.email)
            .digest("hex"),
        );
      },
    },
  },
  {
    sequelize,
    tableName: "users",
  },
);

export default User;
