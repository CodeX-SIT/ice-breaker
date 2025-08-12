import { Model, DataTypes, ForeignKey, NonAttribute } from "sequelize";
import { sequelize } from "./sequelize";
import { User, GameCode } from ".";

export class FlashEvent extends Model {
  public declare id: number;
  public declare gameCodeId: ForeignKey<GameCode["id"]>;
  public declare eventId: string;
  public declare startedAt: Date;
  public declare endsAt: Date;
  public declare isActive: boolean;
  public declare triggeredBy: ForeignKey<User["id"]>;
  public declare eventData: object;
  public declare createdAt: Date;
  public declare updatedAt: Date;

  public declare gameCode?: NonAttribute<GameCode>;
  public declare admin?: NonAttribute<User>;
}

FlashEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gameCodeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "game_codes",
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    triggeredBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    eventData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "flash_events",
    modelName: "FlashEvent",
  },
);
