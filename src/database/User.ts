import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "./index";
import { createHash } from "crypto";
import "server-only";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  public declare id: CreationOptional<number>;
  public declare email: string;
  public declare firstName: string;
  public declare lastName: string;
  public declare password: string;
  // public get name() {
  //   return `${this.firstName} ${this.lastName}`;
  // }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: DataTypes.STRING,
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(val: string) {
        this.setDataValue(
          "password",
          createHash("sha256").update(val).digest("hex"),
        );
      },
    },
  },
  {
    sequelize,
    modelName: "user",
  },
);

(async () => {
  await sequelize.sync();
})();
