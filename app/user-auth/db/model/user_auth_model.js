const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../serve');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid:{
        type: DataTypes.UUIDV4,
        defaultValue: Sequelize.UUIDV4,
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
    },
});

const Cart = sequelize.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'cartId',
    },
    userId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid',
        },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1, // Ensures quantity is positive
        },
    },
    totalprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
    },
});

const SessionToken = sequelize.define('SessionToken', {
    tokenId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'token_id',
    },
    userId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid',
        },
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
    },
    deviceInfo: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'device_info',
    },
    ipAddress: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'ip_address',
    },
    isRevoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_revoked',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
    },
});

module.exports = { User, Cart, SessionToken };