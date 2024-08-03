import "server-only";
import { Model, DataTypes, ForeignKey } from "sequelize";
import { sequelize } from "./sequelize";
import { AdapterUser } from "next-auth/adapters";

// class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
//   public declare id: string;
//   public declare email: string;
//   public declare emailVerified: Date | null;
//   public declare image: string | null;
//   public declare name: string | null;
// }

// User.init(
//   {
//     id: { type: DataTypes.STRING, primaryKey: true },
//     email: { type: DataTypes.STRING, unique: true },
//     emailVerified: { type: DataTypes.DATE, allowNull: true },
//     image: { type: DataTypes.STRING, allowNull: true },
//     name: { type: DataTypes.STRING, allowNull: true },
//   },
//   {
//     sequelize,
//     tableName: "users",
//   },
// );

// export default User;

export class User extends Model<
  AdapterUser & { actualName: string | null },
  Partial<AdapterUser>
> {
  public declare id: string;
  public declare email: string;
  public declare emailVerified: Date | null;
  public declare image: string | null;
  public declare name: string | null;
  public declare actualName: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: "email" },
    emailVerified: { type: DataTypes.DATE },
    image: { type: DataTypes.STRING },
    actualName: { type: DataTypes.STRING },
  },
  {
    sequelize,
    tableName: "users",
  },
);
