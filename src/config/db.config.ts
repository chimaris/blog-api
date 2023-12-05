import { Sequelize } from "sequelize";

const db = new Sequelize("app", "", "", {
	storage: "./data/database.sqlite",
	dialect: "sqlite",
	logging: false,
});

export default db;
