import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));

// Not needed in this case
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(cookieParser());

// Importing routes

import userRouter from "./routes/user.routes.js";
import tourRouter from "./routes/tour.routes.js";

app.use('/api/users', userRouter);
app.use('/api/tours', tourRouter);

export { app }