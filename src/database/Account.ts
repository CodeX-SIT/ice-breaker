import {
  DataTypes,
  ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "./sequelize";

export default class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  public declare userId: ForeignKey<string>;
  public declare type: string;
  public declare provider: string;
  public declare providerAccountId: string;
}

Account.init(
  {
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    providerAccountId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Account",
    tableName: "accounts",
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["provider", "providerAccountId"],
      },
    ],
  },
);
