const { CustomError } = require('../customErrors');

const errorHandler = (err, req, res, next) => {
if (res.headersSent) {
    return next(err);
}

console.error(err);

// Обработка кастомных ошибок
if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(err.errors && { errors: err.errors })
    });
}

// Обработка ошибок Sequelize
if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
    success: false,
    message: 'Ошибка уникальности',
    errors: err.errors.map(e => e.message)
    });
}

// Общая ошибка сервера
res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
});
};

module.exports = errorHandler;