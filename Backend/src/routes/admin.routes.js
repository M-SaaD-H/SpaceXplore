import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addDestination, deleteDestination } from "../controllers/admin.controller.js";

const router = Router();

router.route('/add-destination').post(verifyJWT, addDestination);
router.route('/delete-destination').post(verifyJWT, deleteDestination);

export default router;