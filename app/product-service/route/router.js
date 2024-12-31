const express = require('express');
const jose = require('jose');
const router = express.Router();
const cookieParser = require('cookie-parser');
const productController = require('../http/controller/productController');

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

router.get('/product', async (req, res) => {
    const products = await productController.getAllProducts();
    res.status(200).json(products);
});

router.get('/product/:id', async (req, res) => {
    const products = await productController.getProductById(req.params.id);
    if(products === 'Product not found') {
        return res.status(404).json({message: 'Product not found'});
    }
    res.status(200).json(products);
});

router.post('/product/search', async (req, res) => {
    const products = await productController.searchProduct(req.body.productName);
    res.status(200).json(products);
});

router.post('/product/create', jwthandler, async (req, res) => {
    const product = await productController.createProduct(req.body, req.jwt.payload);
    if(product === 'Unauthorized') {
        return res.status(401).json({message: 'Unauthorized'});
    }
    res.status(201).json(product);
});

router.put('/product/update/:id', jwthandler, async (req, res) => {
    const product = await productController.updateProduct(req.params.id, req.body, req.jwt.payload);
    if(product === 'Product not found') {
        return res.status(404).json({message: 'Product not found'});
    }
    if(product === 'Unauthorized') {
        return res.status(401).json({message: 'Unauthorized'});
    }
    res.status(200).json(product);
});

router.delete('/product/delete/:id', jwthandler, async (req, res) => {
    const product = await productController.deleteProduct(req.params.id, req.jwt.payload);
    if(product === 'Product not found') {
        return res.status(404).json({message: 'Product not found'});
    }
    if(product === 'Unauthorized') {
        return res.status(401).json({message: 'Unauthorized'});
    }

    res.status(200).json({message: 'Product deleted'});
});

module.exports = router;