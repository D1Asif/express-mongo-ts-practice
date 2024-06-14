import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
    defaultPassword: process.env.DEFAULT_PASS
}