const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const errorHandler = require('./routes/error');
const { swaggerUi, swaggerDocs } = require('./swagger');
const morgan = require('morgan');
const passport = require('./config/passport.js');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('[ :method ] :url'));
app.use(passport.initialize());

const docs = express();
docs.use(express.json());
docs.use(cors());
docs.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

const PORT = process.env.PORT;

app.use('/', publicRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use(errorHandler);

sequelize.authenticate()
    .then(() => console.log('Соединение с БД> установлено.'))
    .catch((err) => console.error('Ошибка подключения к БД:', err));

sequelize.sync()
    .then(() => console.log('Модели синхронизированы с БД.'))
    .catch((err) => console.error('Ошибка синхронизации моделей:', err));

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Порт ${PORT} занят. Используйте другой`);
    }
    else {
        console.error('Ошибка при запуске сервера:', err.message);
    }
});

docs.listen(5000, () => {
    console.log(`Swagger UI доступен по адресу http://localhost:${5000}/api-docs`);
  });