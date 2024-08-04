import "server-only";
import "./relations";

// export { Account } from "./Account";
export { Assigned } from "./Assigned";
export { Avatar } from "./Avatar";
export { Hobby } from "./Hobby";
export { GameCode } from "./GameCode";
// export { Session } from "./Session";
export { User } from "./User";
export { UserGame } from "./UserGame";
// export { VerificationTokenModel as VerificationToken } from "./VerificationToken";
export { sequelize } from "./sequelize";

import { sequelize } from "./sequelize";
// sequelize.sync({ force: true });
