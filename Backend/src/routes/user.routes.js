import { Router } from "express";
import { changeCurrentPassword, resendOTP, getAllUserTours, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, verifyOtpAndLoginUser, sendOTPToResetPassword, verifyOTPAndResetPassword } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/register').post(registerUser);
router.route('/verify-otp').post(verifyOtpAndLoginUser);
router.route('/resend-otp').post(resendOTP);
router.route('/login').post(loginUser);

// Secured Routes

router.route('/logout').post(verifyJWT, logoutUser);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/refresh-access-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);

router.route('/send-otp-to-reset-password').post(sendOTPToResetPassword);
router.route('/reset-password').post(verifyOTPAndResetPassword);

router.route('/get-all-tours').get(verifyJWT, getAllUserTours);


export default router;