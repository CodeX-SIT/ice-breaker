import Assigned from "./Assigned";
import User from "./User";
import { sequelize } from "./sequelize";

Assigned.belongsTo(User, { as: "User", foreignKey: "userId" });
Assigned.belongsTo(User, { as: "AssignedUser", foreignKey: "assignedUserId" });

User.hasMany(Assigned, { as: "Assignments", foreignKey: "userId" });
User.hasMany(Assigned, { as: "AssignedTasks", foreignKey: "assignedUserId" });

User.sync({ force: true });
Assigned.sync({ force: true });
