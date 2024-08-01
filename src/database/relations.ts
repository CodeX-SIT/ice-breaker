import { User } from "./User";
import { Assigned } from "./Assigned";
import { Hobby } from "./Hobby";
import { GameCode } from "./GameCode";
import { Avatar } from "./Avatar";

// This user is supposed to find ...
User.hasMany(Assigned, { as: "AssignedUsers", foreignKey: "userId" });

// This user is supposed to found by...
User.hasMany(Assigned, { as: "AssignedToUsers", foreignKey: "assignedUserId" });

Assigned.belongsTo(User, { as: "User", foreignKey: "userId" });
Assigned.belongsTo(User, { as: "AssignedUser", foreignKey: "assignedUserId" });

User.hasMany(Hobby, { as: "Hobbies", foreignKey: "userId" });
Hobby.belongsTo(User, { as: "User", foreignKey: "userId" });

GameCode.hasMany(User);
User.belongsTo(GameCode, { as: "GameCode", foreignKey: "gameCode" });

User.hasOne(Avatar, { as: "Avatar", foreignKey: "userId" });
Avatar.belongsTo(User, { as: "User", foreignKey: "userId" });

// sequelize.sync({ force: true });
