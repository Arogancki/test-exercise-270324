import dotenv from "dotenv";
dotenv.config();

export default {
    NODE_ENV: String(process.env.NODE_ENV) || "dev",
    SERVER_PORT: process.env.PORT || 8080,
    REDIS_URL: String(process.env.REDIS_URL),
};
