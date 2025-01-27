import { Router } from "express";
import { getAllAvailableDestinations, getAllDestinationReviews, getDestinationById } from "../controllers/destination.controller.js";

const router = Router();


router.route('/get-all-destinations').get(getAllAvailableDestinations);
router.route('/d/:destinationID').get(getDestinationById);
router.route('/d/:destinationID/reviews').get(getAllDestinationReviews);


export default router;