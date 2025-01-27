import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MONGO DB CONNECTED !! Host:", connectionInstance.connection.host);
    } catch (error) {
        console.log("ERROR WHILE CONNECTING DB E:", error);
        process.exit(1);
    }
}

export default connectDB;