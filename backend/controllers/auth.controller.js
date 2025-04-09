const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ValidationError } = require('../customErrors');

async function registerUser(req, res, next) {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            throw new ValidationError(['Заполните все поля']);
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new ValidationError(['Email уже используется']);
        }

        const userCount = await User.count();
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            email, 
            name, 
            password: hashedPassword,
            // Если это первый пользователь, назначаем его администратором
            role: (userCount === 0) ? 'admin' : 'user'
        });

        res.status(201).json({ 
            message: 'Регистрация успешна', 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
}

async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ValidationError(['Заполните все поля']);
        }

        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            throw new ValidationError(['Неверный email или пароль']);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new ValidationError(['Неверный email или пароль']);
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Вход выполнен успешно', token });
    } catch (error) {
        next(error);
    }
}

module.exports = { registerUser, loginUser };
