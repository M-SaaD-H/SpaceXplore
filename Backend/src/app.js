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
import destinationRouter from "./routes/destination.routes.js"
import reviewRouter from "./routes/review.routes.js"
import adminRouter from "./routes/admin.routes.js"

app.use('/api/user', userRouter);
app.use('/api/tours', tourRouter);
app.use('/api/destinations', destinationRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/admin', adminRouter);


// To handle the ApiErrors
import { errorHandler } from "./middlewares/error.middleware.js";

app.use(errorHandler);

export { app }