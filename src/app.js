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


// Frontend Routes
import path from "path";
app.set("view engine","ejs");

// Frontend Routes
const __filename = new URL('', import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, '../views'));

app.use("/public", express.static(path.join(__dirname, '../public')));

// app.get ("/",(req,res)=>{
//     res.render("index")
// })

// app.get('/login', (req, res) => {
//     res.render('login');
// })


// app.get('/destinations', (req, res) => {
//     res.render("destinations")
// })

import frontendRotuer from "./routes/frontend.routes.js";

app.use(frontendRotuer);

// import frontendRoutes from "./routes/frontend.routes.js"

// frontendRoutes()


// Importing routes

import userRouter from "./routes/user.routes.js";
import tourRouter from "./routes/tour.routes.js";
import destinationRouter from "./routes/destination.routes.js"
import reviewRouter from "./routes/review.routes.js"
import adminRouter from "./routes/admin.routes.js"
// import paymentRouter from "./routes/payment.routes.js"

app.use('/api/user', userRouter);
app.use('/api/tours', tourRouter);
app.use('/api/destinations', destinationRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/admin', adminRouter);
// app.use('/api/payment', paymentRouter);


// To handle the ApiErrors
import { errorHandler } from "./middlewares/error.middleware.js";

app.use(errorHandler);

export { app }