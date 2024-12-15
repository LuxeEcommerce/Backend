const hashWasm = require('hash-wasm');
const sequelize = require('../serve');
const crypto = require('crypto');
const { User, Cart, SessionToken } = require('../model/user_model');

const seedUserFunction = async () => {
    try {
        await sequelize.authenticate();

        await User.sync();
        await Cart.sync();
        await SessionToken.sync();

        const salt = crypto.randomBytes(16).toString('hex').slice(0, 16);

        const password = await hashWasm.bcrypt({
            password: 'password',
            salt: salt.toString(),
            costFactor: 10,
            outputType: 'encoded'
        })

        await User.bulkCreate([
            {
                username: 'admin',
                password: password,
                email: 'admin@gmail.com',
                role: 'admin',
                salt: salt,
                address: 'admin address',
            },
            {
                username: 'user',
                password: password,
                email: 'user@gmail.com',
                role: 'user',
                salt: salt,
                address: 'user address',
            },
            {
                username: 'seller',
                password: password,
                email: 'seller@gmail.com',
                role: 'seller',
                salt: salt,
                address: 'seller address',
            }
        ]);
        
        await Cart.bulkCreate([
            {
                userId: 1,
                productId: 1,
                quantity: 1,
                totalprice: 1000,
            },
            {
                userId: 2,
                productId: 2,
                quantity: 2,
                totalprice: 2000,
            },
        ]);

        console.log('Database seeded successfully');

    }
    catch (error) {
        console.error('Error synchronizing database:', error);
    }
    finally {
        await sequelize.close();
    }
}

seedUserFunction();