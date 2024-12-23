import { Router } from "express";
import { bookATour, cancelTour } from "../controllers/tour.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/book-tour').post(verifyJWT, bookATour);
router.route('/cancel-tour').post(verifyJWT, cancelTour);

router.route('/get-all-destinations').get(getAllAvailableDestinations);

export default router;