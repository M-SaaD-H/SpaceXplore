import { Router } from 'express';

const router = Router();



router.route('/').get((req, res) => {
    res.render('index');
});

router.route('/login').get((req, res) => {
    res.render('login');
});

router.route('/profile').get((req, res) => {
    res.render('profile');
});

router.route('/destinations').get((req, res) => {
    res.render('destinations');
});

router.route('/destination/d').get((req, res) => {
    res.render('destination-description');
});

router.route('/profile').get((req, res) => {
    res.render('profile');
});

router.route('/payment-success').get((req, res) => {
    res.render('payment-success');
});

router.route('/checkout').get((req, res) => {
    res.render('checkout');
});



export default router;