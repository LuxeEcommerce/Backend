const express = require('express');
const jose = require('jose');
const router = express.Router();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const axios = require('axios');
const {Orders} = require('../db/model/payment_model'); 

const orderController = require('../http/controller/orderController');

router.use(cookieParser('secret'));
router.use(express.json());
router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 60 * 60 * 7 * 1000
    }
}));

const jwthandler = async (req, res, next) => {
    const cookie = req.cookies.token;
    if (!cookie) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const parsedToken = JSON.parse(cookie);
    const jwthex = process.env.JWT_SECRET;
    const bufferString = Buffer.from(jwthex, 'hex');
    const secret = new Uint8Array(bufferString);
    const {payload} = await jose.jwtDecrypt(parsedToken, secret);
    req.jwt = {
        payload: payload
    };
    next();
}

router.get('/successpage', (req, res) => {
    res.send('Payment successful');
});

router.get('/cancelpage', (req, res) => {
    res.send('Payment cancelled');
});

router.post('/makeorder', jwthandler, async (req, res) => {
    const order = await orderController.makeOrder(req.jwt.payload);
    if(order === 'Unauthorized') {
        return res.status(401).json({message: 'Unauthorized'});
    }
    if(order === 'Cart is empty') {
        return res.status(400).json({message: 'Cart is empty'});
    }
    res.status(201).json(order);
});

router.post('/paypalinvoice', jwthandler, async (req, res) => {
    if(!req.session.paypalId) {
        const payment = await orderController.paypalOrder(req.jwt.payload, req.body, req.session.accessToken, req);
        if(payment === 'Unauthorized') {
            return res.status(401).json({message: 'Unauthorized'});
        }

        if(payment === 'Order not found') {
            return res.status(400).json({message: 'Order not found'});
        }

        // res.redirect(payment.links[1].href); 
        res.status(200).json(payment.links[1].href);

    } else {
        res.status(200).json(req.session.paypalApprovalLink);
        // res.status(200).json(payment.links[1].href);
    }
});

router.post('/paypalcapture', async (req, res) => {
    
    const orderId = req.body.resource?.id;
    let accessToken = req.session.accessToken;
    if(!accessToken) {
        accessToken = await orderController.paypalAccessToken(req);
    }

    if(!orderId) {
        return res.status(400).json({message: 'Bad request'});
    }

    const r = req.body.event_type;

    if(r !== 'CHECKOUT.ORDER.APPROVED') {
        return res.status(400).json({message: 'Bad request'});
    }

    try{
    const response = await axios.post(
        `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
        {},
        {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
        }
    );
    
    const orders = await Orders.update({
        orderStatus: 'completed'
    }, {
        where: {
            orderId: 1
        }
    });
    
    return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }

});

router.post('/paypalcomplete', async (req, res) => {
    res.status(200).json({message: 'Payment completed'});
});

module.exports = router;