import { Router } from "express";
import { createTour } from "../controllers/tour.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create-tour').post(verifyJWT, createTour);

export default router;