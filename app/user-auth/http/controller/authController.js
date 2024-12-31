const {bcrypt, bcryptVerify} = require('hash-wasm');
const { Op } = require('sequelize');
const crypto = require('crypto');
const { User, SessionToken } = require('../../db/model/user_auth_model');
const { signedCookie } = require('cookie-parser');
const jose = require('jose');

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

class userAuthController{
    static async loginUser(username, password){
        const user = await User.findOne({
            where: {
                [Op.or]: [{username: username}, {email: username}]
            }
        });
        if(!user){
            return 'User not found';
        }
        const divedSalt = user.salt.substring(0, 32);
        const passwordMatch = await bcryptVerify({
            password: password,
            hash: user.password,
            salt: divedSalt
        });

        if(!passwordMatch){
            return 'Invalid password';
        }
        const token = crypto.randomBytes(16).toString('hex');
        await SessionToken.create({
            token: token,
            userId: user.uuid,
            expiresAt: new Date(Date.now() + 86400000),
            deviceInfo: 'N/A',
            ipAddress: 'N/A',
            isRevoked: false
        });

        const jwthex = process.env.JWT_SECRET;
        const bufferString = Buffer.from(jwthex, 'hex');
        const secret = new Uint8Array(bufferString);
        const jwt = await new jose.EncryptJWT({token: token})
            .setProtectedHeader({alg: 'dir', enc: 'A128CBC-HS256'})
            .setIssuedAt()
            .setIssuer('luxe')
            .setAudience('luxe')
            .setExpirationTime('720h')
            .encrypt(secret);

        

        return jwt;
    }

    static async registerUser(username, password, email){
        const userExists = await User.findOne({
            where: {
                [Op.or]: [{username: username}, {email: email}]
            }
        });
        if(userExists){
            return 'User already exists';
        }
        const salt = crypto.randomBytes(16);
        const salt2 = crypto.randomBytes(16);
        const saltString = salt.toString('hex') + salt2.toString('hex');
        const hashedPassword = await bcrypt({
            password: password,
            salt: salt,
            outputType: 'encoded',
            costFactor: 9
        })
        const user = await User.create({
            username: username,
            password: hashedPassword,
            email: email,
            role: 'user',
            salt: saltString,
            address: 'N/A',
            balance: 0.00,
            uuid: crypto.randomBytes(10).toString('hex'),
        });
        return user;
    }

    static async logoutUser(jwttoken){
        const session = await SessionToken.destroy({
            where: {
                token: jwttoken.payload.token
            }
        });

        

        if(!session){
            const message = {
                message: 'Failed to log out'
            }
            return message;
        }
        
        const message = {
            message: 'User logged out'
        }

        return message;
    }

    static async verifyAdmin(jwttoken){
        const session = await SessionToken.findOne({
            where: {
                token: jwttoken.payload.token
            }
        });

        if(!session){
            return 'Unauthorized';
        }

        const user = await User.findOne({
            where: {
                uuid: session.userId
            }
        });

        if(user.role !== 'admin'){
            return 'Unauthorized';
        }

        return 'Authorized';
    }
}

module.exports = userAuthController;