const { User, Cart, SessionToken, Orders } = require('../../db/model/user_model');
const cookieParser = require('cookie-parser');

class profileController {
    static async getProfileById(jwt) {
        const token = await SessionToken.findOne({
            where: {
                token: jwt.payload.token
            }
        });
    
        if(!token){
            return "Unauthorized"; 
        }
    
        const user = await User.findOne({
            where: {
                uuid: token.userId
            },
        });
    
        if(!user){
            return "Unauthorized";
        }

        return user;
    }

    static async getUserCartById(jwt) {
        const token = await SessionToken.findOne({
            where: {
                token: jwt.payload.token
            }
        });
        
        if(!token){
            return "Unauthorized";
        }
    
        const cart = await Cart.findAll({
            where: {
                userId: token.userId
            }
        });
    
        if(!cart){
            return "empty";
        }

        return cart;
    }  

    static async checkout() {
        return "Checkout";
    }

    static async getUserOrderById(jwt) {    
        const token = await SessionToken.findOne({
            where: {
                token: jwt.payload.token
            }
        });
        
        if(!token){
            return "Unauthorized";
        }

    
        const order = await Orders.findAll({
            where: {
                userId: token.userId
            }
        });
    
        if(order.length === 0){
            return "empty";
        }


        return order;
        
    }

    static async getUserHistoryById(jwt){
        const token = await SessionToken.findOne({
            where: {
                token: jwt.payload.token
            }
        });
        
        if(!token){
            return "Unauthorized";
        }
    
        const history = await Orders.findAll({
            where: {
                userId: token.userId,
                order_status: "completed"
            }
        });
    
        if(!history){
            return "empty";
        }

        return history;
    }

    static async addToCart(jwt, product) {
        const token = await SessionToken.findOne({
            where: {
                token: jwt.payload.token
            }
        });

        if(!token){
            return "Unauthorized";
        }

        const cart = await Cart.create({
            userId: token.userId,
            productId: product.productId,
            quantity: product.quantity,
            totalprice: product.totalprice
        });

        return cart;

    }
}

module.exports = profileController;