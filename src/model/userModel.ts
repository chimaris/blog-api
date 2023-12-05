import { DataTypes, Model } from "sequelize";
import db from "../config/db.config";
import { PostInstance } from "./postModel";

export interface User {
	id: string;
	username: string;
	email: string;
	password: string;
}

export class UserInstance extends Model<User> {}

UserInstance.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ sequelize: db, tableName: "user" }
);