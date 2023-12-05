import { DataTypes, Model } from "sequelize";
import db from "../config/db.config";
import { PostInstance } from "./postModel";

export interface Category {
	id: string;
	name: string;
}

export class CategoryInstance extends Model<Category> {}

CategoryInstance.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ sequelize: db, tableName: "category" }
);
