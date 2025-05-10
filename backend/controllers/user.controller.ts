import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '@models/user';
import Event from '@models/event';
import { NotFoundError, ValidationError, CustomError } from '@/customErrors';
import { Model, ModelStatic } from 'sequelize';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
  sequelizeModel?: any;
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
    const { firstName, lastName, middleName, email, password, gender, birthDate, role } = req.body;
    
    if (!firstName || !lastName || !middleName || !email || !password || !gender || !birthDate) {
      throw new ValidationError([
        'Все обязательные поля должны быть заполнены',
      ]);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError(['Пользователь с таким email уже существует']);
    }

    // Validate birth date
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime()) || birthDateObj >= new Date()) {
      throw new ValidationError(['Некорректная дата рождения']);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      middleName,
      email,
      password: hashedPassword,
      gender,
      birthDate: birthDateObj,
      role: role || 'user',
    });

    // Create a new object without password instead of deleting it
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      gender: user.gender,
      birthDate: user.birthDate,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json(userResponse);
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
    const resource = await req.sequelizeModel?.findByPk(id);

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

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new CustomError('Не авторизован', 401);
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'middleName', 'email', 'gender', 'birthDate', 'role', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundError('Пользователь');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new CustomError('Не авторизован', 401);
    }

    const { firstName, lastName, middleName, gender, birthDate } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !middleName || !gender || !birthDate) {
      throw new ValidationError(['Все обязательные поля должны быть заполнены']);
    }

    // Validate birth date
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime()) || birthDateObj >= new Date()) {
      throw new ValidationError(['Некорректная дата рождения']);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError('Пользователь');
    }

    // Update user profile
    await user.update({
      firstName,
      lastName,
      middleName,
      gender,
      birthDate: birthDateObj,
    });

    // Get updated user data without password
    const updatedUser = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'middleName', 'email', 'gender', 'birthDate', 'role', 'createdAt'],
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserEvents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    
    if (!req.user) {
      throw new CustomError('Не авторизован', 401);
    }

    // Проверяем, что пользователь запрашивает свои события или является админом
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      throw new CustomError('Недостаточно прав', 403);
    }

    const events = await Event.findAll({
      where: { createdBy: userId },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'middleName'],
        },
      ],
      order: [['date', 'DESC']],
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
};
