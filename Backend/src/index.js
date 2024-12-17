import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js"

dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("E:", error);
        throw error;
    });

    app.listen(process.env.PORT, () => {
        console.log("App is listening on PORT:", process.env.PORT);
    });
})
.catch((error)=> {
    console.log("MONGO DB CONNECTION FAILED !! E:", error);
});