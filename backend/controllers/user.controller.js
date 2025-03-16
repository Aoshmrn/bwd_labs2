const User = require('../models/user');
const { NotFoundError, ValidationError } = require('../customErrors');

async function createUser(req, res, next) {
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