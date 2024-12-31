const { Product, Category, SessionToken, User } = require('../../db/model/product_model');
const cookieParser = require('cookie-parser');

class productController {
    static async getAllProducts() {
        const products = await Product.findAll();
        return products;
    }

    static async getProductById(id) {
        const product = await Product.findOne({
            where: {
                productId: id
            }
        });

        if(!product) {
            return 'Product not found';
        }
        return product;
    }

    static async createProduct(productData, payload) {
        const session = await SessionToken.findOne({
            where: {
                token: payload.token
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

        if(!user) {
            return 'Unauthorized';
        }
        console.log(user);
        if(user.role !== 'admin') {
            return 'Unauthorized';
        }

        const product = await Product.create({
            productName: productData.productName,
            productDescription: productData.productDescription,
            productPrice: productData.productPrice,
            productImage: productData.productImage,
            productStock: productData.productStock,
            productCategory: productData.productCategory
        });

        return product;
    }

    static async updateProduct(id, productData, payload) {
        const session = await SessionToken.findOne({
            where: {
                token: payload.token
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

        if(!user) {
            return 'Unauthorized';
        }
        if(user.role !== 'admin') {
            return 'Unauthorized';
        }

        const product = await Product.findOne({
            where: {
                productId: id
            }
        });

        if(!product) {
            return 'Product not found';
        }

        product.productName = productData.productName;
        product.productDescription = productData.productDescription;
        product.productPrice = productData.productPrice;
        product.productImage = productData.productImage;
        product.productStock = productData.productStock;
        product.productCategory = productData.productCategory;

        await product.save();

        return product;
    }

    static async deleteProduct(id, payload) {
        const session = await SessionToken.findOne({
            where: {
                token: payload.token
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

        if(!user) {
            return 'Unauthorized';
        }
        if(user.role !== 'admin') {
            return 'Unauthorized';
        }
        
        const product = await Product.findOne({
            where: {
                product_id: id
            }
        });

        if(!product) {
            return 'Product not found';
        }

        await product.destroy();

        return 'Product deleted';
    }

    static async searchProduct(search) {
        if(!search) {
            const products = await Product.findAll();
            return products;
        }
        const products = await Product.findAll({
            where: {
                productName: search
            }
        });

        if(!products) {
            return 'Product not found';
        }

        return products;
    }
}

module.exports = productController;