import { User } from "./User";
import { Assigned } from "./Assigned";
import { Hobby } from "./Hobby";
import { sequelize } from "./sequelize";
import { GameCode } from "./GameCode";
import { Avatar } from "./Avatar";

// This user is supposed to find ...
User.hasMany(Assigned, { as: "assignedUsers", foreignKey: "userId" });

// This user is supposed to found by...
User.hasMany(Assigned, { as: "assignedToUsers", foreignKey: "assignedUserId" });

Assigned.belongsTo(User, { as: "user", foreignKey: "userId" });
Assigned.belongsTo(User, { as: "assignedUser", foreignKey: "assignedUserId" });

User.hasOne(Hobby, { as: "hobby", foreignKey: "userId" });
Hobby.belongsTo(User, { as: "user", foreignKey: "userId" });

GameCode.hasMany(User, { as: "users", foreignKey: "gameCodeId" });
User.belongsTo(GameCode, { as: "gameCode", foreignKey: "gameCodeId" });

User.hasOne(Avatar, { as: "avatar", foreignKey: "userId" });
Avatar.belongsTo(User, { as: "user", foreignKey: "userId" });

sequelize.sync({ alter: true });
