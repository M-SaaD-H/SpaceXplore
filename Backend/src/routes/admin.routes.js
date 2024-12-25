import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addDestination, deleteDestination, updateDestinationDetails } from "../controllers/admin.controller.js";

const router = Router();

router.route('/add-destination').post(verifyJWT, addDestination);
router.route('/delete-destination').post(verifyJWT, deleteDestination);
router.route('/d/:destinationID/update-destination-details').post(verifyJWT, updateDestinationDetails);

export default router;