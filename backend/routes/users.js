const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Создание нового пользователя
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Обязательные поля: name, email' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании пользователя', error });
    }
});

// Получение списка пользователей
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении списка пользователей', error });
    }
});

module.exports = router;