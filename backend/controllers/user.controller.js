const User = require('../models/user');
const { ValidationError } = require('../customErrors');

async function createUser(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new ValidationError(['Заполните все поля']);
        }

        const user = await User.create({ name, email, password });
        res.status(201).json({ message: 'Пользователь создан', user });
    } catch (error) {
        next(error);
    }
}

async function getAllUser(req, res, next) {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

module.exports = { createUser, getAllUser };