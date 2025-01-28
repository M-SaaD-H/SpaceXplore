import { Router } from 'express';
import { createOrder } from '../controllers/razorpay.controller.js';
import { verifyPayment } from '../utils/razorpay/webhook.js';

const router = Router();

router.route('/create-order').post(createOrder);
router.route('/verify-payment').post(verifyPayment);


export default router;