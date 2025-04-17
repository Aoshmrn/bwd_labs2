import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@/customErrors';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  // Обработка кастомных ошибок
  if (err instanceof CustomError) {
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
      errors: err.errors.map((e: any) => e.message),
    });
    return;
  }

  // Общая ошибка сервера
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
  });
};

export default errorHandler;
