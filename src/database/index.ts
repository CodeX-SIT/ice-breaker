import "server-only";
import User from "./User";
import Assigned from "./Assigned";
import Hobby from "./Hobby";
import "./relations";
import { sequelize } from "./sequelize";

export { User, Assigned, Hobby, sequelize };
