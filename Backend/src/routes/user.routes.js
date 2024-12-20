import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Secured Routes

router.route('/logout').post(verifyJWT, logoutUser);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/refresh-access-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);


export default router;