const express = require('express');
const userAuthController = require('../http/controller/authController');
const jose = require('jose');
const router = express.Router();
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

router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await userAuthController.loginUser(username, password)
    if(user === 'User not found'){
        return res.status(404).json({
            message: 'User not found'
        });
    }else if(user === 'Invalid password'){
        return res.status(401).json({
            message: 'Invalid password'
        });
    }

    res.cookie('token', JSON.stringify(user), {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });

    return res.status(200).json({
        message: 'User logged in'
    });
});

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    
    const user = await userAuthController.registerUser(username, password, email);
    if(user === 'User already exists'){
        return res.status(409).json({
            message: 'User already exists'
        });
    }
    return res.status(201).json({message: 'User Registered'});

});

router.post('/logout', jwthandler, async (req, res) => {
    const token = req.jwt;
    const user = await userAuthController.logoutUser(token);
    if(user.message === 'Failed to log out'){
        return res.status(501).json({message: 'Failed to log out'});
    }
    res.clearCookie('token');
    return res.status(200).json({
        message: 'User logged out'
    });
})

module.exports = router;
