const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {        
    dialect: 'mysql',
    logging: true,
    pool: {
        max: 5,        
        min: 0,         
        idle: 10000,    
        acquire: 30000,
    },
    dialectOptions: {
      connectTimeout: 10000, 
    },
});

module.exports = sequelize;