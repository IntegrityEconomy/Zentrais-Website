import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME || "zentrais_marketplace",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    models: [path.join(__dirname, "..", "models")],
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export const connectDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database connection established successfully.");

        // Sync models with database (use migrations in production)
        if (process.env.NODE_ENV !== "production") {
            await sequelize.sync({ alter: true });
            console.log("✅ Database models synchronized.");
        }
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
        throw error;
    }
};

export default sequelize;
