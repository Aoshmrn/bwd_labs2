const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./backend/config/db');
const eventRoutes = require('./backend/routes/events');
const userRoutes = require('./backend/routes/users');
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT;

app.use('/events', eventRoutes);
app.use('/users', userRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Соединение с БД> установлено.');
    })
    .catch((err) => {
        console.error('Ошибка подключения к БД:', err);
    });

sequelize.sync()
    .then(() => {
        console.log('Модели синхронизированы с БД.');
    })
    .catch((err) => {
        console.error('Ошибка синхронизации моделей:', err);
    });

app.listen(PORT, () => {
    console.log(`Сервер запущен на http:localhost:${PORT}`);
}).on('eror', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Порт ${PORT} занят. Используйте другой`);
    }
    else {
        console.error('Ошибка при запуске сервера:', err.message);
    }
});