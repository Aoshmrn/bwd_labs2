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

async function updateUserRole(req, res, next) {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            throw new ValidationError(['Недопустимая роль']);
        }

        const user = await User.findByPk(id);
        if (!user) {
            throw new ValidationError(['Пользователь не найден']);
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            message: 'Роль обновлена',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

async function checkRole(req, res, next) {
    try {
        if (!req.user) {
            throw new ValidationError(['Не авторизован']);
        }

        if (req.user.role !== 'admin') {
            throw new ValidationError(['Недостаточно прав']);
        }

        next();
    } catch (error) {
        next(error);
    }
}

async function checkOwnership(req, res, next) {
    try {
        if (req.user.role === 'admin') {
            return next();
        }

        const resourceId = req.params.id;
        const resource = await req.model.findByPk(resourceId);

        if (!resource) {
            throw new ValidationError(['Ресурс не найден']);
        }

        if (resource.createdBy !== req.user.id) {
            throw new ValidationError(['Недостаточно прав']);
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { 
    createUser, 
    getAllUser, 
    updateUserRole,
    checkRole,
    checkOwnership
};