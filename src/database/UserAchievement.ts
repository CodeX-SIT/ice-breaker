import { Model, DataTypes, ForeignKey, NonAttribute } from "sequelize";
import { sequelize } from "./sequelize";
import { User, Achievement, GameCode } from ".";

export class UserAchievement extends Model {
  public declare id: number;
  public declare userId: ForeignKey<User["id"]>;
  public declare achievementId: ForeignKey<Achievement["id"]>;
  public declare gameCodeId: ForeignKey<GameCode["id"]> | null;
  public declare metadata: object | null;
  public declare awardedAt: Date;
  public declare createdAt: Date;
  public declare updatedAt: Date;

  public declare achievement?: NonAttribute<Achievement>;
  public declare user?: NonAttribute<User>;
  public declare gameCode?: NonAttribute<GameCode>;
}

UserAchievement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    achievementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "achievements",
        key: "id",
      },
    },
    gameCodeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "game_codes",
        key: "id",
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    awardedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user_achievements",
    modelName: "UserAchievement",
  },
);
