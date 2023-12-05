import { DataTypes, Model } from "sequelize";
import db from "../config/db.config";
import { UserInstance } from "./userModel";
import { CategoryInstance } from "./categoryModel";

export interface Post {
	id: string;
	title: string;
	content: string;
	category: string;
	author: string;
}

export class PostInstance extends Model<Post> {}

PostInstance.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category: {
			type: DataTypes.STRING,
		},
		author: {
			type: DataTypes.STRING,
		},
	},
	{ sequelize: db, tableName: "post" }
);

PostInstance.belongsTo(UserInstance, { foreignKey: "author", as: "author" });
PostInstance.belongsTo(CategoryInstance, { foreignKey: "category", as: "category" });
UserInstance.hasMany(PostInstance, { foreignKey: "author", as: "author" });
CategoryInstance.hasMany(PostInstance, { foreignKey: "category", as: "category" });
