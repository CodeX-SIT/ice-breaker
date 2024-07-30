import {
  DataTypes,
  ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "./sequelize";
import { AdapterAccount, AdapterAccountType } from "next-auth/adapters";
import { AccountInstance } from "@/auth/adapter";
import { AuthorizationDetails } from "oauth4webapi";
import "server-only";

// export default class Account extends Model<
//   InferAttributes<Account>,
//   InferCreationAttributes<Account>
// > {
//   public declare userId: ForeignKey<string>;
//   public declare type: string;
//   public declare provider: string;
//   public declare providerAccountId: string;
// }

// Account.init(
//   {
//     provider: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     providerAccountId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     type: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "Account",
//     tableName: "accounts",
//     timestamps: true,
//     paranoid: true,
//     underscored: true,
//     indexes: [
//       {
//         unique: true,
//         fields: ["provider", "providerAccountId"],
//       },
//     ],
//   },
// );

//@ts-expect-error
export class Account
  extends Model<AdapterAccount, Partial<AdapterAccount>>
  implements AccountInstance
{
  public declare expires_in?: number | undefined;
  public declare authorization_details?: AuthorizationDetails[] | undefined;
  public declare type: AdapterAccountType;
  public declare provider: string;
  public declare providerAccountId: string;
  public declare refresh_token: string | undefined;
  public declare access_token: string | undefined;
  public declare expires_at: number | undefined;
  public declare token_type: Lowercase<string> | undefined;
  public declare scope: string | undefined;
  public declare id_token: string | undefined;
  public declare userId: string;
}

Account.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: { type: DataTypes.STRING, allowNull: false },
    provider: { type: DataTypes.STRING, allowNull: false },
    providerAccountId: { type: DataTypes.STRING, allowNull: false },
    refresh_token: { type: DataTypes.STRING },
    access_token: { type: DataTypes.STRING },
    expires_at: { type: DataTypes.INTEGER },
    token_type: { type: DataTypes.STRING },
    scope: { type: DataTypes.STRING },
    id_token: { type: DataTypes.TEXT },
    session_state: { type: DataTypes.STRING },
    userId: { type: DataTypes.UUID },
  },
  {
    sequelize,
    tableName: "accounts",
    paranoid: true,
  },
);
