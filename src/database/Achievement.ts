import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize";

export class Achievement extends Model {
  public declare id: number;
  public declare name: string;
  public declare description: string;
  public declare icon: string;
  public declare criteria: object;
  public declare createdAt: Date;
  public declare updatedAt: Date;
}

Achievement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    criteria: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "achievements",
    modelName: "Achievement",
  },
);
