const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    }
);

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Соединение с БД установленно');
    } catch(eror){
        console.error('Ошибка подключения к БД:', eror);
    }
};

module.exports = sequelize;