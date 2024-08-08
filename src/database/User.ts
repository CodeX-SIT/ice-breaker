import { Model, DataTypes, ForeignKey, NonAttribute } from "sequelize";
import { sequelize } from "./sequelize";
import { AdapterUser } from "next-auth/adapters";
import { Avatar } from "avataaars";
import { AboutUser, Assigned } from ".";
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
  public declare avatar: NonAttribute<Avatar>;
  public declare aboutUser: NonAttribute<AboutUser>;
  public declare assignedUsers: NonAttribute<Assigned[]>;
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
    modelName: "User"
  },
);
