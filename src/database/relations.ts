import Assigned from "./Assigned";
import User from "./User";
import Hobby from "./Hobby";
import { sequelize } from "./sequelize";

// This user is supposed to find ...
User.hasMany(Assigned, { as: "AssignedUsers", foreignKey: "userId" });

// This user is supposed to found by...
User.hasMany(Assigned, { as: "AssignedToUsers", foreignKey: "assignedUserId" });

Assigned.belongsTo(User, { as: "User", foreignKey: "userId" });
Assigned.belongsTo(User, { as: "AssignedUser", foreignKey: "assignedUserId" });

User.hasMany(Hobby, { as: "Hobbies", foreignKey: "userId" });
Hobby.belongsTo(User, { as: "User", foreignKey: "userId" });

// sequelize.sync({ force: true });
// User.sync({ force: true });
// Assigned.sync({ force: true });
