const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../serve');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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

const Orders = sequelize.define('Orders', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'order_id',
    },
    orderStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'order_status',
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid',
        },
    },
    totalPrice : {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_price',
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

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Orders,
            key: 'order_id',
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
            min: 1,
        },
    },
    price : {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    totalPrice : {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_price',
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

const Invoices = sequelize.define('Invoices', {
    invoiceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'invoice_id',
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Orders,
            key: 'order_id',
        },
    },
    invoiceStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'invoice_status',
    },
    invoiceUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'invoice_url',
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_amount',
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'due_date',
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

const Category = sequelize.define('Category', {
    categoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'category_id',
    },
    categoryName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'category_name',
    },
    catergoryDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'category_description',
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

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_id',
    },
    productName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'product_name',
    },
    productDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'product_description',
    },
    productPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'product_price',
    },
    productImage: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'product_image',
    },
    productCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'category_id',
        },
    },
    productStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_stock',
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



module.exports = { User, Cart, SessionToken, Orders, OrderItem, Invoices, Category, Product };