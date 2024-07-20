import { Model, Sequelize, DataTypes } from "sequelize";
import { createHash } from "crypto";
import "server-only";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

export class User extends Model<
  {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  },
  {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }
> {
  public id!: number;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public get name() {
    return `${this.firstName} ${this.lastName}`;
  }
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
