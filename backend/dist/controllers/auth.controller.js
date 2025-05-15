'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const user_1 = __importDefault(require('@models/user'));
const customErrors_1 = require('@/customErrors');
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new customErrors_1.ValidationError([
        'Все поля обязательны для заполнения',
      ]);
    }
    const existingUser = await user_1.default.findOne({ where: { email } });
    if (existingUser) {
      throw new customErrors_1.ValidationError(['Email уже используется']);
    }
    const userCount = await user_1.default.count();
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await user_1.default.create({
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
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new customErrors_1.ValidationError(['Email и пароль обязательны']);
    }
    const user = await user_1.default.findOne({ where: { email } });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
      throw new customErrors_1.ValidationError(['Неверные учетные данные']);
    }
    const token = jsonwebtoken_1.default.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    res.status(200).json({ message: 'Вход успешен', token });
  } catch (error) {
    next(error);
  }
};
exports.loginUser = loginUser;
