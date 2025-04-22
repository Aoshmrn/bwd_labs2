"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = exports.checkRole = exports.updateUserRole = exports.createUser = exports.getAllUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("@models/user"));
const customErrors_1 = require("@/customErrors");
const getAllUser = async (req, res, next) => {
    try {
        const users = await user_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUser = getAllUser;
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            throw new customErrors_1.ValidationError([
                'Все обязательные поля должны быть заполнены',
            ]);
        }
        const existingUser = await user_1.default.findOne({ where: { email } });
        if (existingUser) {
            throw new customErrors_1.ValidationError(['Пользователь с таким email уже существует']);
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await user_1.default.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            throw new customErrors_1.ValidationError(['Некорректная роль']);
        }
        const user = await user_1.default.findByPk(id);
        if (!user) {
            throw new customErrors_1.NotFoundError('Пользователь');
        }
        user.role = role;
        await user.save();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
const checkRole = (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            throw new customErrors_1.CustomError('Недостаточно прав', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkRole = checkRole;
const checkOwnership = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new customErrors_1.CustomError('Не авторизован', 401);
        }
        const { id } = req.params;
        const resource = await req.sequelizeModel?.findByPk(id);
        if (!resource) {
            throw new customErrors_1.NotFoundError('Ресурс');
        }
        if (req.user.role !== 'admin' &&
            resource.createdBy !== req.user.id) {
            throw new customErrors_1.CustomError('Недостаточно прав', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkOwnership = checkOwnership;
