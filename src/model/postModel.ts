import { DataTypes, Model } from "sequelize";
import db from "../config/db.config";
import { UserInstance } from "./userModel";
import { CategoryInstance } from "./categoryModel";

export interface Post {
	id: string;
	title: string;
	content: string;
	categoryId: string;
	authorId: string;
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
		categoryId: {
			type: DataTypes.STRING,
		},
		authorId: {
			type: DataTypes.STRING,
		},
	},
	{ sequelize: db, tableName: "post" }
);

PostInstance.belongsTo(UserInstance, { foreignKey: "authorId", as: "author" });
PostInstance.belongsTo(CategoryInstance, { foreignKey: "categoryId", as: "category" });
UserInstance.hasMany(PostInstance, { foreignKey: "authorId", as: "posts" });
CategoryInstance.hasMany(PostInstance, { foreignKey: "categoryId", as: "posts" });
