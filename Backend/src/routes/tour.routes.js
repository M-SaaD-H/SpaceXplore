import { Router } from "express";
import { bookATour } from "../controllers/tour.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/book-tour').post(verifyJWT, bookATour);

export default router;