const express = require('express');
const { User, SessionToken } = require('../db/model/user_model');
const jose = require('jose');
const router = express.Router();
const profileController = require('../http/controller/profileController');
const cookieParser = require('cookie-parser');

router.use(cookieParser('secret'))

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


router.get('/profile', jwthandler, async (req, res) => {
    const jwt = await req.jwt;
    const user = await profileController.getProfileById(jwt, res);
    if(user === "Unauthorized"){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({
        id: user.id,
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        address: user.address,
    });
});

router.get('/cart', jwthandler ,async (req, res) => {
    const jwt = await req.jwt;
    const cart = await profileController.getUserCartById(jwt, res);
    if(cart === "Unauthorized"){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(cart === "empty"){
        return res.status(200).json({ message: 'Cart is empty' });
    }
    return res.status(200).json(cart);
});

router.get('/order',  jwthandler , async(req, res)  => {
    const jwt = req.jwt;
    const order = await profileController.getUserOrderById(jwt);   
    if(order === "Unauthorized"){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(order === "empty"){
        return res.status(200).json({ message: 'Order is empty' });
    }

    return res.status(200).json(order);
});

router.get('/history', jwthandler ,(req, res) => {
    const jwt = req.jwt;
    const history = profileController.getUserHistoryById(jwt);
    if(history === "Unauthorized"){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(history === "empty"){
        return res.status(200).json({ message: 'History is empty' });
    }
    return res.status(200).json(history);    
});

router.post('/addtocart', jwthandler, async (req, res) => {
    const jwt = req.jwt;
    const product = req.body;
    const cart = await profileController.addToCart(jwt, product, res);
    if(cart === "Unauthorized"){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(200).json(cart);
});


module.exports = router;
    