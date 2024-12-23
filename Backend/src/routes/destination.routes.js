import { Router } from "express";
import { getAllAvailableDestinations } from "../controllers/destination.controller.js";

const router = Router();


router.route('/get-all-destinations').get(getAllAvailableDestinations);


export default router;