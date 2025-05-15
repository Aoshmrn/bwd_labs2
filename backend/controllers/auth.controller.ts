import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/user';
import { ValidationError } from '@/customErrors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      gender,
      birthDate,
      email,
      password,
    } = req.body;
    if (!firstName || !email || !password) {
      throw new ValidationError(['Все поля обязательны для заполнения']);
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError(['Email уже используется']);
    }
    const userCount = await User.count();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      middleName,
      gender,
      birthDate,
      email,
      password: hashedPassword,
      role: userCount === 0 ? 'admin' : 'user',
    });

    // Generate JWT token after registration
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Регистрация успешна',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        gender: user.gender,
        birthDate: user.birthDate,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ValidationError(['Email и пароль обязательны']);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ValidationError(['Пользователь с таким email не найден']);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ValidationError(['Неверный пароль']);
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Вход успешен',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        gender: user.gender,
        birthDate: user.birthDate,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
