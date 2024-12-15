const {Orders, Cart, SessionToken, User} = require('../../db/model/payment_model');
const axios = require('axios');

class orderController {
    static async makeOrder(jwt) {
        const session = await SessionToken.findOne({
            where: {
                token: jwt.token
            }
        });

        if(!session) {
            return 'Unauthorized';
        }

        const cart = await Cart.findAll({
            where: {
                userId: session.userId
            }
        });

        if(cart.length === 0) {
            return 'Cart is empty';
        }

        let totalPrice = 0;

        cart.forEach((item) => {
            totalPrice += parseFloat(item.totalprice);
        });

        const order = await Orders.create({
            userId: session.userId,
            orderStatus: 'pending',
            totalPrice: totalPrice,
        });

        await Cart.destroy({
            where: {
                userId: session.userId
            }
        });

        return order;
    }

    static async paypalAccessToken(req) {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        const response = await axios.post(
            'https://api.sandbox.paypal.com/v1/oauth2/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
                },
            }
        );

        req.session.accessToken = response.data.access_token;

        return response.data.access_token;
    }

    static async paypalOrder(jwt, reqbody, access_token, req) {
        const session = await SessionToken.findOne({
            where: {
                token: jwt.token
            }
        });

        if(!session) {
            return 'Unauthorized';
        }

        const user = await User.findOne({
            where: {
                uuid: session.userId
            }
        });

        const order = await Orders.findOne({
            where: {
                userId: user.uuid,
                orderStatus: 'pending',
                orderId: reqbody.orderId
            }
        });

        if(!order) {
            return 'Order not found';
        }

        let accessToken;

        if(!access_token) {
            accessToken = await this.paypalAccessToken(req);
        }else{
            accessToken = access_token;
        }

        try{
        const response = await axios.post(
            'https://api.sandbox.paypal.com/v2/checkout/orders',
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: order.totalPrice,
                        },
                        custom_id: reqbody.orderId,
                    },
                ],
                "application_context": {
                    "return_url": "https://3e91-66-96-225-129.ngrok-free.app/api/pay/payment/successpage",
                    "cancel_url": "https://3e91-66-96-225-129.ngrok-free.app/api/pay/payment/cancelpage"
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
            }
        );
        
        req.session.paypalId = response.data.id;
        req.session.paypalSelfLink = response.data.links[0].href;
        req.session.paypalApprovalLink = response.data.links[1].href;
        req.session.paypalUpdateLink = response.data.links[2].href;
        req.session.paypalCaptureLink = response.data.links[3].href;
        
        return response.data;

        } catch (error) {
            return error;
        }

    }

    static async paypalCapture(orderId, req) {
        let accessToken = req.session.accessToken;

        if(!accessToken) {
            accessToken = await this.paypalAccessToken(req);
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

        const customOrderId = response.data.purchase_units[0].custom_id;

        const orders = await Orders.update({
            orderStatus: 'completed'
        }, {
            where: {
                orderId: customOrderId
            }
        });
        
        return response.data;

        } catch (error) {
            console.log(error);
            return error;
        }

    }
        


}

module.exports = orderController;