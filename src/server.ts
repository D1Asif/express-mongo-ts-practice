import config from "./app/config";
import mongoose from "mongoose";
import app from "./app";

async function main() {
    try {
        await mongoose.connect(config.databaseUrl as string);

        app.listen(config.port, () => {
            console.log(`Example app listening on port ${config.port}`)
        })
    } catch (err) {
        console.log(err);
    }
}

main();
