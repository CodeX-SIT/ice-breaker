import { User } from "./User";
import { Assigned } from "./Assigned";
import { AboutUser } from "./AboutUser";
import { GameCode } from "./GameCode";
import { Avatar } from "./Avatar";
import { UserGame } from "./UserGame";
import { sequelize } from "./sequelize";
import { Selfie } from "./Selfie";
import { Achievement } from "./Achievement";
import { UserAchievement } from "./UserAchievement";
import { FlashEvent } from "./FlashEvent";

// This user is supposed to find ...
User.hasMany(Assigned, { as: "assignedUsers", foreignKey: "userId" });

// This user is supposed to found by...
User.hasMany(Assigned, { as: "assignedToUsers", foreignKey: "assignedUserId" });

Assigned.belongsTo(User, { as: "user", foreignKey: "userId" });
Assigned.belongsTo(User, { as: "assignedUser", foreignKey: "assignedUserId" });

User.hasOne(AboutUser, { as: "aboutUser", foreignKey: "userId" });
AboutUser.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasOne(Avatar, { as: "avatar", foreignKey: "userId" });
Avatar.belongsTo(User, { as: "user", foreignKey: "userId" });

GameCode.hasMany(Assigned, { as: "assigned", foreignKey: "gameCodeId" });
Assigned.belongsTo(GameCode, { as: "gameCode", foreignKey: "gameCodeId" });

User.belongsToMany(GameCode, {
  as: "gameCodes",
  foreignKey: "userId",
  through: UserGame,
});
GameCode.belongsToMany(User, {
  as: "users",
  foreignKey: "gameCodeId",
  through: UserGame,
});

GameCode.belongsTo(User, { as: "admin", foreignKey: "userId" });
User.hasMany(GameCode, { as: "gameCode", foreignKey: "userId" });

Assigned.hasOne(Selfie, { as: "selfie", foreignKey: "assignedId" });
Selfie.belongsTo(Assigned, { as: "assigned", foreignKey: "assignedId" });

// Achievement relationships
Achievement.hasMany(UserAchievement, {
  as: "userAchievements",
  foreignKey: "achievementId",
});
UserAchievement.belongsTo(Achievement, {
  as: "achievement",
  foreignKey: "achievementId",
});

User.hasMany(UserAchievement, { as: "userAchievements", foreignKey: "userId" });
UserAchievement.belongsTo(User, { as: "user", foreignKey: "userId" });

GameCode.hasMany(UserAchievement, {
  as: "achievements",
  foreignKey: "gameCodeId",
});
UserAchievement.belongsTo(GameCode, {
  as: "gameCode",
  foreignKey: "gameCodeId",
});

// Flash Event relationships
GameCode.hasMany(FlashEvent, { as: "flashEvents", foreignKey: "gameCodeId" });
FlashEvent.belongsTo(GameCode, { as: "gameCode", foreignKey: "gameCodeId" });

User.hasMany(FlashEvent, {
  as: "triggeredFlashEvents",
  foreignKey: "triggeredBy",
});
FlashEvent.belongsTo(User, { as: "admin", foreignKey: "triggeredBy" });

// sequelize.sync();
