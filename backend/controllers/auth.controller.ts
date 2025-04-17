import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { ValidationError } from '../customErrors';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ValidationError(['Все поля обязательны для заполнения']);
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ValidationError(['Email уже используется']);
    }
    const userCount = await User.count();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userCount === 0 ? 'admin' : 'user',
    });
    res.status(201).json({ message: 'Регистрация успешна', user });
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
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ValidationError(['Неверные учетные данные']);
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    res.status(200).json({ message: 'Вход успешен', token });
  } catch (error) {
    next(error);
  }
};
