'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const customErrors_1 = require('@/customErrors');
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  // Обработка кастомных ошибок
  if (err instanceof customErrors_1.CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }
  // Обработка ошибок Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(400).json({
      success: false,
      message: 'Ошибка уникальности',
      errors: err.errors.map((e) => e.message),
    });
    return;
  }
  // Общая ошибка сервера
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
  });
};
exports.default = errorHandler;
