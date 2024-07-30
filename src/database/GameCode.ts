import {
  Model,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from './sequelize';
import { randomBytes } from 'crypto';
import "server-only";

export class GameCode extends Model<InferAttributes<GameCode>, InferCreationAttributes<GameCode>> {
  public declare id: CreationOptional<number>;
  public declare code: string;
  public declare expiry: Date;

  public static generateCode(): string {
    return randomBytes(3).toString('hex');
  }
  // unix time
  public static async createGameCode(): Promise<GameCode> {
    const code = this.generateCode();
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now
    return await this.create({ code, expiry });
  }

  public static async validateGameCode(code: string): Promise<boolean> {
    const gameCode = await this.findOne({ where: { code } });

    if (!gameCode) {
      return false; // Code does not exist
    }

    if (new Date() > gameCode.expiry) {
      await gameCode.destroy(); // Remove expired code
      return false; // Code expired
    }

    return true; // Code is valid
  }
}

GameCode.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, unique: true },
    expiry: { type: DataTypes.DATE },
  },
  {
    sequelize,
    tableName: 'gamecode',
  }
);

