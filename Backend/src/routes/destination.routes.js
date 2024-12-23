import { Router } from "express";
import { getAllAvailableDestinations, getDestinationById } from "../controllers/destination.controller.js";

const router = Router();


router.route('/get-all-destinations').get(getAllAvailableDestinations);
router.route('/d/:destinationID').get(getDestinationById);


export default router;