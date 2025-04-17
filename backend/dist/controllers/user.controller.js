"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = exports.checkRole = exports.updateUserRole = exports.createUser = exports.getAllUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const customErrors_1 = require("../customErrors");
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUser = getAllUser;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            throw new customErrors_1.ValidationError([
                'Все обязательные поля должны быть заполнены',
            ]);
        }
        const existingUser = yield user_1.default.findOne({ where: { email } });
        if (existingUser) {
            throw new customErrors_1.ValidationError(['Пользователь с таким email уже существует']);
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield user_1.default.create({
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
});
exports.createUser = createUser;
const updateUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            throw new customErrors_1.ValidationError(['Некорректная роль']);
        }
        const user = yield user_1.default.findByPk(id);
        if (!user) {
            throw new customErrors_1.NotFoundError('Пользователь');
        }
        user.role = role;
        yield user.save();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
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
const checkOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            throw new customErrors_1.CustomError('Не авторизован', 401);
        }
        const { id } = req.params;
        const resource = yield ((_a = req.sequelizeModel) === null || _a === void 0 ? void 0 : _a.findByPk(id));
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
});
exports.checkOwnership = checkOwnership;
