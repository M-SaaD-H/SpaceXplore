import { Router } from "express";
import { cancelTour, createOrder, verifyPaymentAndCreateTour } from "../controllers/tour.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create-order').post(verifyJWT, createOrder);
router.route('/verify-payment').post(verifyJWT, verifyPaymentAndCreateTour);
router.route('/cancel-tour').delete(verifyJWT, cancelTour);


export default router;