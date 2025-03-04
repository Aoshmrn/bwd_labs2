const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { ValidationError, NotFoundError } = require('../customErrors');

router.post('/', async (req, res, next) => {
try {
    const { name, email } = req.body;
    const errors = [];
    
    if (!name) errors.push('Поле name обязательно');
    if (!email) errors.push('Поле email обязательно');
    
    if (errors.length > 0) {
    throw new ValidationError(errors);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
    throw new ValidationError(['Пользователь с таким email уже существует']);
    }

    const user = await User.create({ name, email });
    res.status(201).json(user);
} catch (error) {
    next(error);
}
});

router.get('/', async (req, res, next) => {
try {
    const users = await User.findAll();
    res.status(200).json(users);
} catch (error) {
    next(error);
}
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Пользователи
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Пользователи]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Пользователи]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Пользователь создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверные данные
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 */