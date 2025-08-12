import "server-only";
import "./relations";

export { Assigned } from "./Assigned";
export { Avatar } from "./Avatar";
export { AboutUser } from "./AboutUser";
export { GameCode } from "./GameCode";
export { User } from "./User";
export { UserGame } from "./UserGame";
export { Selfie } from "./Selfie";
export { Achievement } from "./Achievement";
export { UserAchievement } from "./UserAchievement";
export { FlashEvent } from "./FlashEvent";
export { sequelize } from "./sequelize";

import { sequelize } from "./sequelize";
// sequelize.sync({ force: true });
