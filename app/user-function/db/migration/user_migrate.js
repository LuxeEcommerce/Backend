const sequelize = require('../serve');
const { User, Cart, SessionToken, Orders, OrderItem, Product, Category, Invoices } = require('../model/user_model');

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SessionToken, { foreignKey: 'userId' });
SessionToken.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Orders, { foreignKey: 'userId' });
Orders.belongsTo(User, { foreignKey: 'userId' });

Orders.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Orders, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Invoices, { foreignKey: 'userId' });
Invoices.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Product, { foreignKey: 'productCategory' });
Product.belongsTo(Category, { foreignKey: 'productCategory' });

const syncDB = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');
    }
    catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

syncDB();




