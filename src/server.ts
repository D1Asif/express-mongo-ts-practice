import config from "./app/config";
import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";

let server: Server;

async function main() {
    try {
        await mongoose.connect(config.databaseUrl as string);

        server = app.listen(config.port, () => {
            console.log(`Example app listening on port ${config.port}`)
        })
    } catch (err) {
        console.log(err);
    }
}

main();

process.on('unhandledRejection', () => {
    console.log("👿 Unhandled rejection detected. Shutting down the server...");
    if(server) {
        server.close(() => {
            process.exit(1);
        })
    }
});

process.on('uncaughtException', () => {
    console.log("😠 Uncaught exception detected. Shutting down the server...");
    process.exit(1);
});

