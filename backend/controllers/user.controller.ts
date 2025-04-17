import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { NotFoundError, ValidationError, CustomError } from '../customErrors';
import { Model, ModelStatic } from 'sequelize';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
  sequelizeModel?: typeof Model;
}

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      throw new ValidationError([
        'Все обязательные поля должны быть заполнены',
      ]);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError(['Пользователь с таким email уже существует']);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      throw new ValidationError(['Некорректная роль']);
    }

    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError('Пользователь');
    }

    user.role = role;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const checkRole = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new CustomError('Недостаточно прав', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const checkOwnership = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('Не авторизован', 401);
    }

    const { id } = req.params;
    const resource = await (req.sequelizeModel as ModelStatic<Model>)?.findByPk(
      id,
    );

    if (!resource) {
      throw new NotFoundError('Ресурс');
    }

    if (
      req.user.role !== 'admin' &&
      (resource as any).createdBy !== req.user.id
    ) {
      throw new CustomError('Недостаточно прав', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
